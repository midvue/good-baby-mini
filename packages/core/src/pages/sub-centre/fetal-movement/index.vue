<script lang="tsx">
import { defineComponent, onUnmounted, reactive, watch } from 'vue'
import { Picker } from '@tarojs/components'
import { Navbar, Image, showPopup } from '@mid-vue/taro-h5-ui'
import { dateFormat, useDate } from '@mid-vue/shared'
import { FetalRecord } from './components/fetal-record'
import { apiAddFetalMovement } from './api'

export default defineComponent({
  name: 'UterineContraction',
  setup() {
    // 创建孕周状态管理
    const state = reactive({
      selectedWeek: 19,
      selectedDay: 0,
      //倒计时
      countdown: 3599,
      //点击次数
      clickCount: 0,
      //有效次数
      validCount: 0,
      timer: null as NodeJS.Timeout | null,
      lastValidClickTime: 0,
      dueDate: '',
      recordTime: '',
      currentRemarkIndex: 0,
      isCountingEnded: false
    })
    const remarkList = [
      '坚持数完一个小时才会有历史记录哦',
      '1小时候胎动少于3次有可能是缺氧',
      '5分钟内的胎动都算1次哦'
    ]
    // 修改周和天数组，添加单位文本
    const weeks = Array.from({ length: 42 - 19 + 1 }, (_, i) => ({
      value: 19 + i,
      text: `${19 + i}周` // 添加"周"单位
    }))
    const days = Array.from({ length: 7 }, (_, i) => ({
      value: i,
      text: `${i}天` // 添加"天"单位
    }))

    // 计算预产期：基于当前孕周推算（标准孕期40周）
    const calculateDueDate = (week: number, day: number) => {
      const today = useDate() // 获取当前日期
      const totalGestationalDays = 40 * 7 // 标准孕期总天数（40周）
      const currentGestationalDays = week * 7 + day // 当前孕周对应的天数
      const remainingDays = totalGestationalDays - currentGestationalDays // 剩余天数
      return today.add(remainingDays, 'day').format('YYYY-MM-DD') // 使用Dayjs标准add方法    }
    }
    // 初始化及监听孕周变化更新预产期
    const updateGestationalInfo = () => {
      state.dueDate = calculateDueDate(state.selectedWeek, state.selectedDay)
    }

    // 初始计算预产期
    updateGestationalInfo()

    // 监听孕周/天变化，实时更新预产期
    watch(
      () => [state.selectedWeek, state.selectedDay],
      () => updateGestationalInfo(),
      { immediate: true }
    )
    const saveFetalRecord = async () => {
      try {
        // 准备请求数据
        const recordData = {
          count: state.validCount, // 有效胎动次数
          recordTime: state.recordTime, // 记录时间
          expectDate: state.dueDate // 预产期
        }

        // 调用新增记录API
        await apiAddFetalMovement(recordData)
      } catch (error) {
        console.error('胎动记录保存失败:', error)
      }
    }
    // 启动倒计时
    const startCountdown = () => {
      state.recordTime = useDate().format('YYYY-MM-DD HH:mm:ss')
      // 清除已有定时器防止重复
      if (state.timer) clearInterval(state.timer)
      // 重置状态
      state.isCountingEnded = false
      state.timer = setInterval(() => {
        if (state.countdown > 0) {
          state.countdown--
        } else {
          // 倒计时结束，清除定时器
          if (state.timer) {
            clearInterval(state.timer)
          }
          state.timer = null
          state.isCountingEnded = true
          // 保存胎动记录
          saveFetalRecord()
        }
      }, 1000) // 每秒更新一次
    }

    // 组件卸载时清除定时器，防止内存泄漏
    onUnmounted(() => {
      if (state.timer) {
        clearInterval(state.timer)
      }
    })

    const onRecordClick = () => {
      showPopup({
        round: true,
        height: '80%',
        title: '胎动记录',
        render() {
          return <FetalRecord />
        }
      })
    }
    const onOperateClick = () => {
      if (!state.timer) {
        if (state.isCountingEnded) {
          state.countdown = 3599 // 重置倒计时
          state.clickCount = 0
          state.validCount = 0
        }
        startCountdown()
        state.lastValidClickTime = 0
      } else {
        state.clickCount++
        const now = Date.now() // 当前时间戳（毫秒）
        // 5分钟 = 300000毫秒，判断距离上次有效点击是否超过5分钟
        if (now - state.lastValidClickTime >= 300000) {
          state.validCount++ // 超过5分钟，增加有效次数
          state.lastValidClickTime = now // 更新最后有效点击时间戳
        }
      }
      // 随机选择一个提示信息索引（0-2）
      state.currentRemarkIndex = Math.floor(Math.random() * 3)
    }
    const onPickerChange = (e: any) => {
      const [weekIdx, dayIdx] = e.detail.value
      const selectedWeek = weeks[weekIdx].value
      const selectedDay = days[dayIdx].value
      state.selectedWeek = selectedWeek
      state.selectedDay = selectedDay
    }
    return () => (
      <div class='fetal-movement'>
        <Navbar title='胎动计数' />
        <div class='fetal-date'>
          孕{state.selectedWeek}周{state.selectedDay}天,预产期是{state.dueDate}
        </div>
        <div class='fetal-movement-content'>
          <div class='fetal-left'>
            <Picker
              mode='multiSelector'
              range={[weeks, days]}
              range-key='text'
              onChange={(e: any) => onPickerChange(e)}
            >
              <Image src='centre/icon_fetal_date.png' class='fetal-icon' />
              <div class='text-center'>修改孕周</div>
            </Picker>
          </div>
          <div class='fetal-operate' onClick={() => onOperateClick()}>
            {state.timer ? (
              <>
                <div class='fetal-text'>动一下/点一下</div>
                <div class='fetal-time'>{dateFormat(state.countdown * 1000, 'mm:ss')}</div>
              </>
            ) : state.isCountingEnded ? (
              <>
                <div class='fetal-restart'>点击重新开始</div>
                <div class='fetal-result'>胎动{state.validCount < 3 ? '异常' : '较少'}</div>
                <div class='fetal-count'>
                  有效
                  <span>{state.validCount}</span>次
                </div>
              </>
            ) : (
              <>
                <div class='fetal-text'>开始计数</div>
                <Image src='centre/img_fetal_start.png' class='fetal-start-icon' />
              </>
            )}
          </div>
          <div class='fetal-right' onClick={() => onRecordClick()}>
            <Image src='centre/icon_fetal_record.png' class='fetal-icon' />
            <div>胎动记录</div>
          </div>
        </div>
        <div class='fetal-remark'>{remarkList[state.currentRemarkIndex]}</div>
        <div class='fetal-data'>
          <span class='fetal-data-num'> {state.validCount}</span> / {state.clickCount}
        </div>
        <div class='fetal-summary'>
          <span>有效</span>
          <span>点击</span>
        </div>
      </div>
    )
  }
})
</script>
<style lang="scss">
@import './index.scss';
</style>
