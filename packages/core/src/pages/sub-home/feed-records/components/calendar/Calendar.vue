<template>
  <div class="calendar">
    <div class="section-slider">
      <!-- 年月切换区域 -->
      <div class="slider-year-month">
        <span class="month-change" @click="handleTriggleMonth('last')">上一月</span>
        <div class="current-month" @click="showPopup">
          <VmPicker
            v-model="state.currentStr"
            mode="date"
            :end="todayFormatted"
            @change="onDateChange"
          >
            {{ state.currentFormatted }}
          </VmPicker>
          <MvIcon name="down" />
        </div>
        <span
          class="month-change"
          @click="handleTriggleMonth('next')"
          :disabled="isNextMonthDisabled"
          :class="{ 'no-change': isNextMonthDisabled }"
        >
          下一月
        </span>
      </div>
      <!-- 星期展示区域 -->
      <div class="slider-week">
        <div v-for="(item, index) in weekText" :key="index" class="week-item">
          {{ item }}
        </div>
      </div>
      <!-- 日期展示区域 -->
      <div class="slider-day">
        <div
          v-for="(item, index) in state.list"
          :key="index"
          class="day-item"
          :class="{
            'no-show': isFutureDate(item.date),
            'not-current-month': !item.isCurrMonth,
            'day-item-sel': isSelectedDay(item)
          }"
          @click="chooseDay(item)"
        >
          <span class="day">{{ item.day }}</span>
        </div>
      </div>
      <!-- 展开/收起按钮 -->
      <div class="slider-shrink" @click="expandeDate">
        <span>{{ state.isExpand ? '收起' : '展开' }}</span>
      </div>
    </div>
    <!-- 返回今天按钮 -->
    <div v-show="state.isExpand" class="back-top" @click="backToday">回到今天</div>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref, watch, computed } from 'vue'
import { useDate } from '@mid-vue/shared'
import { Icon as MvIcon, Picker as VmPicker } from '@mid-vue/taro-h5-ui'
import type { ICalendarItem, ICListState } from './type'

// 定义 props
const props = defineProps({
  current: { type: Date, required: true },
  list: { type: Array as () => Array<ICalendarItem>, required: true },
  expended: { type: Boolean, required: true }
})

// 定义 emits
const emit = defineEmits(['change', 'update:current', 'expand', 'update:expended'])

// 星期文本数组
const weekText: string[] = ['一', '二', '三', '四', '五', '六', '日']

// 响应式状态
const state = reactive<
  ICListState & {
    currentStr: string
    currentFormatted: string
  }
>({
  isExpand: false,
  backToday: false,
  current: useDate().toDate(),
  currentStr: useDate().format('YYYY-MM-DD'),
  currentFormatted: useDate().format('YYYY年MM月'),
  list: props.list
})

// 控制选择器显示状态
const showDPicker = ref(false)

// 计算属性：今天的日期格式化字符串
const todayFormatted = computed(() => useDate().format('YYYY-MM-DD'))

// 计算属性：判断是否禁用下一月按钮
const isNextMonthDisabled = computed(() => useDate().isSame(state.current, 'month'))

// 计算属性：判断日期是否为未来日期
const isFutureDate = (date: Date) => useDate(date).startOf('day').isAfter(useDate().startOf('day'))

// 计算属性：判断是否为选中日期
const isSelectedDay = (item: ICalendarItem) =>
  useDate(state.current).date() === item.day && item.isCurrMonth

// 获取日历列表
const getList = () => {
  const cList = props.list
  if (state.isExpand) {
    state.list = cList
  } else {
    const currWeek = useDate(props.current).day() || 7
    const index =
      cList?.findIndex((item) => item.day === useDate(props.current).date() && item.isCurrMonth) + 1
    if (index) {
      state.list = cList.slice(index - currWeek, index + 7 - currWeek)
    }
  }
}

// 监听 props.current 变化
watch(
  () => props.current,
  (newVal) => {
    state.current = newVal
    state.currentStr = useDate(newVal).format('YYYY-MM-DD')
    state.currentFormatted = useDate(newVal).format('YYYY年MM月')
  },
  { immediate: true }
)

// 监听 props.expended 变化
watch(
  () => props.expended,
  (newVal) => {
    state.isExpand = newVal
    emit('expand', !newVal)
  }
)

// 监听展开状态和列表变化
watch(
  () => [state.isExpand, props.list],
  () => {
    getList()
  },
  { immediate: true }
)

// 展开/收起操作
const expandeDate = () => {
  state.isExpand = !state.isExpand
  emit('expand', state.current)
  emit('update:expended', state.isExpand)
}

// 显示日期选择器
const showPopup = () => {
  showDPicker.value = true
  state.current = props.current
}

// 日期选择确认
const onDateChange = () => {
  state.current = useDate(state.currentStr).toDate()
  emit('change', state.current)
}

// 返回今天
const backToday = () => {
  const today = useDate().toDate()
  state.isExpand = false
  state.current = today
  state.currentStr = useDate(today).format('YYYY-MM-DD')
  state.currentFormatted = useDate(today).format('YYYY年MM月')
  emit('change', today)
}

// 选择某一日期
const chooseDay = (item: ICalendarItem) => {
  const today = useDate().startOf('day').toDate()
  const selectedDate = useDate(item.date).startOf('day').toDate()
  if (selectedDate > today) return

  emit('change', selectedDate)
  emit('update:current', useDate(state.current).date(item.day).toDate())
  state.isExpand = false
}

// 切换上下月
const handleTriggleMonth = (type: 'last' | 'next') => {
  if (type === 'next' && isNextMonthDisabled.value) return
  const newMonth =
    type === 'last'
      ? useDate(state.current).subtract(1, 'month')
      : useDate(state.current).add(1, 'month')

  const newDate = newMonth.startOf('month').toDate()
  state.current = newDate
  state.currentStr = useDate(newDate).format('YYYY-MM-DD')
  state.currentFormatted = useDate(newDate).format('YYYY年MM月')
  emit('change', newDate)
}
</script>

<style lang="scss">
@import './index.scss';
</style>
