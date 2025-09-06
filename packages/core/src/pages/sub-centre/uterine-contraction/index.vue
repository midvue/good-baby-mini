<script lang="tsx">
import { computed, defineComponent } from 'vue'
import { ScrollView } from '@tarojs/components'
import { durationFormat, useDate } from '@mid-vue/shared'
import { Button, FooterBar, Navbar, showDialog, showToast, Image } from '@mid-vue/taro-h5-ui'
import { defineCtxState } from '@mid-vue/use'
import { apiAddUterineRecord, apiDeleteUterineRecord, apiGetUterineRecords } from './api'
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

    const headers = [
      {
        title: '开始时间',
        className: 'item-start-time'
      },
      {
        title: '时长',
        className: 'item-time'
      },
      {
        title: '间隔',
        className: 'item-time'
      }
    ]

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
        await apiAddUterineRecord(state.form)
        showToast('添加成功')
        //提交成功,重置数据
        setState((state) => {
          state.form = { ...defaultForm }
        })
        getList()
      }
    }
    const onReset = async () => {
      showDialog({
        title: '重置记录',
        render: () => '确认重置所有记录吗？',
        onConfirm: async () => {
          await apiDeleteUterineRecord({ ids: state.list.map((item) => item.id!) })
          getList()
        }
      })
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
          <div class='header-time'>
            <Image src='centre/img_centre_urerine.png' class='header-bg' />
            <div class='header-time-text'>{durationRef.value}</div>
          </div>
          <Button type='primary' round class='header-btn' onClick={handleSubmit}>
            {state.form.duration ? '结束记录' : '开始记录'}
          </Button>
        </div>
        <div class='uterine-contraction-records mv-hairline--top'>
          <div class='uterine-contraction-item item-title'>
            {headers.map((item, index) => (
              <div class={item.className} key={index}>
                {item.title}
              </div>
            ))}
          </div>
          <ScrollView class='contraction-records-scroll' scroll-y showScrollbar={false} enhanced>
            <div class='contraction-records-content'>
              {state.list.map((item) => (
                <div class='uterine-contraction-item mv-hairline--top' key={item.startTime}>
                  <div class='item-start-time'>
                    {useDate(item.startTime).format('DD日HH:mm:ss')}
                  </div>
                  <div class='item-time'>
                    {durationFormat(item.duration, { format: 'mm分ss秒', unit: 's' })}
                  </div>
                  <div class='item-time'>
                    {durationFormat(item.interval, { format: 'mm分ss秒', unit: 's' }) || '---'}
                  </div>
                </div>
              ))}
            </div>
          </ScrollView>
        </div>
        <FooterBar border>
          <Button type='primary' round size='large' onClick={onReset}>
            重置
          </Button>
        </FooterBar>
      </div>
    )
  }
})
</script>
<style lang="scss">
@import './index.scss';
</style>
