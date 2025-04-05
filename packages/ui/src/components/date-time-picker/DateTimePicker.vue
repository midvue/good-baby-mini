<template>
  <Picker
    class="mv-date-time-picker"
    mode="multiSelector"
    v-bind="$attrs"
    :value="multiIndex"
    :range="range"
    range-key="label"
    @change="handleMultiChange"
    @columnchange="handleMultiColChange"
  >
    <view class="mv-date-time-picker__label">
      <slot name="label" v-if="$slots.label"></slot>
      <template v-else>
        <view class="placeholder" v-show="!modelValue">{{ placeholder }}</view>
        <view> {{ modelValue }} </view>
      </template>
    </view>
  </Picker>
</template>
<script lang="ts">
import { defineComponent, reactive, toRefs, watch } from 'vue'
import { type IPickerState, props } from './props'
import { deepClone, useDate } from '@mid-vue/shared'
import { BaseEventOrig, Picker, PickerMultiSelectorProps } from '@tarojs/components'

export default defineComponent({
  name: 'MvDateTimePicker',
  components: { Picker },
  inheritAttrs: false,
  props,
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const state: IPickerState = reactive({
      start: props.start
        ? useDate(props.start).valueOf()
        : useDate().subtract(6, 'month').valueOf(),
      end: props.end ? useDate(props.end).valueOf() : useDate().valueOf(),
      multiIndex: [],
      range: []
    })

    function initRange() {
      //处理日期
      let currTime = state.start
      const dateList = []
      while (currTime <= state.end) {
        let label = useDate(currTime).format(props.labelFormat[0])
        dateList.push({
          value: useDate(label).valueOf(),
          label
        })
        currTime += 24 * 60 * 60 * 1000
      }
      let endDate = useDate(state.end)
      let hours = initHours(endDate.hour())
      let minutes = initMinutes(endDate.minute())

      state.range = [dateList, hours, minutes]
    }

    /** 处理小时 */
    function initHours(end: number = 23) {
      //处理时间
      let hours = []
      let startDay = useDate().startOf('day')
      for (let i = 0; i <= end; i++) {
        hours.push({
          label: startDay.add(i, 'hour').format(props.labelFormat[1]),
          value: i * 60 * 60 * 1000
        })
      }
      return hours
    }

    /** 处理分钟 */
    function initMinutes(end = 59) {
      let minutes = []
      let startHour = useDate().startOf('hour')
      for (let i = 0; i <= end; i++) {
        minutes.push({
          label: startHour.add(i, 'minute').format(props.labelFormat[2]),
          value: i * 60 * 1000
        })
      }
      return minutes
    }

    initRange()

    watch(
      () => props.modelValue,
      (val) => {
        state.multiIndex = modelValue2Index(val)
      },
      {
        immediate: true
      }
    )

    const handleMultiChange = (e: BaseEventOrig<PickerMultiSelectorProps.ChangeEventDetail>) => {
      const index = e.detail.value

      //角标换label
      let value = index2ModelValue(index)

      emit('update:modelValue', value)
      props?.onChange(value)
    }

    //列改变时触发
    const handleMultiColChange = (
      e: BaseEventOrig<PickerMultiSelectorProps.ColumnChangeEventDetail>
    ) => {
      const col = e.detail.column
      const rowIndex = e.detail.value
      state.multiIndex[col] = rowIndex
      let endDate = useDate(state.end)

      if (col === 0) {
        let dayLabel = endDate.format(props.labelFormat[col])
        // 如果选中的日期是今天
        const isToday = dayLabel === state.range[col][state.multiIndex[col]].label
        state.range[1] = isToday ? initHours(endDate.hour()) : initHours()
        state.range[2] = isToday ? initMinutes(endDate.minute()) : initMinutes()
      } else if (col === 1) {
        // 如果选中的是当前小时
        let hourLabel = endDate.format(props.labelFormat[col])
        const isCurrentHour = hourLabel === state.range[col][state.multiIndex[col]].label
        state.range[2] = isCurrentHour ? initMinutes(endDate.minute()) : initMinutes()
      }

      state.range = deepClone(state.range)
    }

    /** 时间转选中的下标 */
    function modelValue2Index(val: string | number) {
      if (!val) return [0, 0, 0]

      return state.range.reduce(
        (indexList, currArr, index) => {
          let i = currArr.findIndex((item) => {
            return useDate(val).format(props.labelFormat[index]) === item.label
          })
          indexList[index] = i
          return indexList
        },
        [0, 0, 0]
      )
    }

    /** 下标转时间 */
    function index2ModelValue(arr: number[]) {
      let value = arr.reduce((value, num, index) => {
        value += state.range[index][num].value
        return value
      }, 0)
      return useDate(value).format(props.valueFormat)
    }

    return {
      ...toRefs(state),
      handleMultiChange,
      handleMultiColChange,
      initRange
    }
  }
})
</script>
<style lang="scss">
.mv-date-time-picker {
  width: 100%;
  height: 100%;
  position: relative;
  font-size: 14px;
  &__label {
    display: flex;
    align-items: center;
    min-height: 22px;
  }

  &__row {
    width: 100%;
    display: flex;
    align-items: center;
  }

  .placeholder {
    color: var(--mv-placeholder-color);
  }
}
</style>
