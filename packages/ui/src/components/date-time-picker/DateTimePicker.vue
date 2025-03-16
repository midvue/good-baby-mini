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
import { useDate } from '@mid-vue/shared'
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

    //  multiArray: [['无脊柱动物', '脊柱动物'], ['扁性动物', '线形动物', '环节动物', '软体动物', '节肢动物'], ['猪肉绦虫', '吸血虫']],

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

      //处理时间
      let hours = []
      for (let i = 0; i < 24; i++) {
        hours.push({
          label: useDate().startOf('hour').add(i, 'hour').format(props.labelFormat[1]),
          value: i * 60 * 60 * 1000
        })
      }

      let minutes = []
      for (let i = 0; i < 60; i++) {
        minutes.push({
          label: useDate().startOf('minute').add(i, 'minute').format(props.labelFormat[2]),
          value: i * 60 * 1000
        })
      }

      state.range = [dateList, hours, minutes]
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
      console.log(value, 22)

      emit('update:modelValue', value)
      props?.onChange(value)
    }

    //列改变时触发
    const handleMultiColChange = (
      e: BaseEventOrig<PickerMultiSelectorProps.ColumnChangeEventDetail>
    ) => {
      const col = e.detail.column
      const row = e.detail.value
      state.multiIndex[col] = row
    }

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

    function index2ModelValue(arr: number[]) {
      // let value = arr.reduce((value, num, index) => {
      //   value += state.range[index][num].value
      //   return value
      // }, 0)
      let value = `${state.range[0][arr[0]].label} ${state.range[1][arr[1]].label}: ${state.range[2][arr[2]].label} `

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
