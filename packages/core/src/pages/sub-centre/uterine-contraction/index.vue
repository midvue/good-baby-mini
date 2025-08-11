<script lang="tsx">
import { computed, defineComponent } from 'vue'
import { durationFormat, useDate } from '@mid-vue/shared'
import { Button, hideLoading, Navbar, showLoading, showToast } from '@mid-vue/taro-h5-ui'
import { defineCtxState } from '@mid-vue/use'
import { apiAddUterineRecord, apiGetUterineRecords } from './api'
import type { UterineContraction, UterineContractionState } from './types'

const defaultForm: UterineContraction = {
  startTime: '',
  endTime: '',
  duration: 0,
  interval: 0
}

export default defineComponent({
  name: 'UterineContraction',
  setup() {
    const [state, setState] = defineCtxState<UterineContractionState>({
      list: [] as UterineContraction[],
      form: { ...defaultForm }
    })

    //获取记录
    const getList = async () => {
      const list = await apiGetUterineRecords()
      setState((state) => {
        state.list = list
      })
    }
    getList()

    let timer = -1
    //处理计时器
    const handleTimer = () => {
      //如果没有开始时间,则开始时间为当前时间
      if (!state.form.startTime) {
        state.form.startTime = useDate().format('YYYY-MM-DD HH:mm:ss')
        //启动计时
        state.form.duration = 0
        clearInterval(timer)
        timer = window.setInterval(() => {
          state.form.duration++
        }, 1000)
        return false
      }
      //如果有开始时间,则结束时间为当前时间
      state.form.endTime = useDate().format('YYYY-MM-DD HH:mm:ss')
      clearInterval(timer)
      return true
    }
    //提交数据
    const handleSubmit = async () => {
      if (handleTimer()) {
        //提交数据
        //计算间隔时间
        if (state.list.length) {
          state.form.interval = useDate(state.form.startTime).diff(
            useDate(state.list[0].endTime),
            's'
          )
        }
        showLoading()
        await apiAddUterineRecord(state.form).finally(() => hideLoading())
        showToast('添加成功')
        //提交成功,重置数据
        setState((state) => {
          state.form = { ...defaultForm }
        })
        getList()
      }
    }
    const durationRef = computed(() => {
      if (!state.form.duration) {
        return '00:00'
      }
      return durationFormat(state.form.duration, {
        format: 'mm:ss',
        unit: 's'
      })
    })

    return () => (
      <div class='uterine-contraction'>
        <Navbar title='宫缩计时' />
        <div class='uterine-contraction-header'>
          <div class='header-time'> {durationRef.value}</div>
          <Button type='primary' round class='header-btn' onClick={handleSubmit}>
            {state.form.duration ? '结束记录' : '开始记录'}
          </Button>
        </div>
        <div class='uterine-contraction-list'>
          {state.list.map((item) => (
            <div class='uterine-contraction-item' key={item.startTime}>
              <div class='item-time'>{useDate(item.startTime).format('MM月DD日HH:mm:ss')}</div>
              <div class='item-duration'>
                {durationFormat(item.duration, { format: 'mm分ss秒', unit: 's' })}
              </div>
              <div class='item-interval'>
                {durationFormat(item.interval, { format: 'mm分ss秒', unit: 's' }) || '---'}
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }
})
</script>
<style lang="scss">
@import './index.scss';
</style>
