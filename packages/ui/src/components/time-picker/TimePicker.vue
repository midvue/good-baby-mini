<template>
  <picker
    class="mv-time-picker"
    mode="multiSelector"
    v-bind="$attrs"
    :range-key="labelKey"
    :value="multiIndex"
    :range="range"
    @change="hanldeMultiChange"
    @columnchange="hanldeMultiColChange"
  >
    <view class="mv-time-picker__label">
      <slot name="label" v-if="$slots.label"></slot>
      <template v-else>
        <view class="placeholder" v-show="!modelValue.length">{{ placeholder }}</view>
        <view v-for="(value, i) in modelValue" :key="i">
          {{ i === 1 ? '&nbsp;:' : '' }}
          {{ value }}
        </view>
      </template>
    </view>
  </picker>
</template>
<script lang="ts">
import { defineComponent, reactive, toRefs, watch } from 'vue'
import { type IPickerState, props } from './props'

export default defineComponent({
  name: 'MvTimePicker',
  components: {},
  inheritAttrs: false,
  props,
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const state: IPickerState = reactive({
      multiIndex: new Array(props.level).fill(0),
      range: new Array(props.level).fill(0).map(() => [])
    })

    const date = new Date()
    const today = {
      hours: date.getHours(),
      minutes: date.getMinutes()
    }

    // let weeks = ["日", "一", "二", "三", "四", "五", "六"];

    const getNumTwoBit = (n: number) => {
      return n > 9 ? n : '0' + n
    }

    // const getDayInfo = (i = 0) => {
    //   let date = new Date();
    //   const diff = i * (1000 * 60 * 60 * 24);
    //   date = new Date(date.getTime() + diff);
    //   let year = date.getFullYear();
    //   let month = date.getMonth() + 1;
    //   let day = date.getDate();
    //   let weekDay = date.getDay();

    //   return {
    //     label: `${month}月${day}日周${weeks[weekDay]}`,
    //     value: `${year}-${getNumTwoBit(month)}-${getNumTwoBit(day)}`,
    //   };
    // };

    const initDate = () => {
      // for (let i = 0; i < props.maxDay; i++) {
      //   state.range[0].push(getDayInfo(i));
      // }

      for (let i = 0; i < 24; i++) {
        state.range[0].push({
          label: `${i}点`,
          value: `${getNumTwoBit(i)}`
        })
        if (i === today.hours) {
          state.multiIndex[1] = i
        }
      }

      let minutes = 0
      let i = 0
      while (minutes < 60) {
        state.range[1].push({
          label: `${minutes}分`,
          value: `${getNumTwoBit(minutes)}`
        })
        minutes += 5
        i++
        if (minutes >= today.minutes && minutes - today.minutes <= 5) {
          state.multiIndex[2] = i
        }
      }

      state.multiIndex = [...state.multiIndex]
      state.range = JSON.parse(JSON.stringify(state.range))
    }

    initDate()

    watch(
      () => [props.level, props.data.length],
      () => {
        state.multiIndex = new Array(props.level).fill(0)
        state.range = new Array(props.level).fill(0).map(() => [])
      }
    )

    watch(
      () => props.modelValue,
      () => {
        //根据默认值 回显
        state.multiIndex = [...state.multiIndex]
        state.range = JSON.parse(JSON.stringify(state.range))
      },
      {
        immediate: true
      }
    )

    const hanldeMultiChange = (e) => {
      const indexs = e.detail.value

      //角标换label
      const values = indexs.map((j, i) => {
        return state.range[i][j]?.[props.valueKey]
      })

      console.log(values)

      emit('update:modelValue', values)
    }

    //列改变时触发
    const hanldeMultiColChange = (e) => {
      const col = e.detail.column
      const row = e.detail.value
      state.multiIndex[col] = row
    }

    return {
      ...toRefs(state),
      hanldeMultiChange,
      hanldeMultiColChange
    }
  }
})
</script>
<style lang="scss">
.mv-time-picker {
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
    color: $placeholder-color;
  }
}
</style>
