<template>
  <picker
    class="mv-multi-picker"
    mode="multiSelector"
    v-bind="$attrs"
    :range-key="conf.label"
    :value="multiIndex"
    :range="range"
    @change="handleMultiChange"
    @columnchange="handleMultiColChange"
  >
    <view class="mv-multi-picker__label">
      <slot name="label" v-if="$slots.label"></slot>
      <template v-else>
        <view class="placeholder" v-show="!modelValue.length">{{ placeholder }}</view>
        <view v-for="(value, i) in modelValue" :key="i">
          {{ i !== 0 && value ? '/' : '' }}{{ value || range[i][0]?.[conf.label] }}
        </view>
      </template>
    </view>
  </picker>
</template>
<script lang="ts">
import { defineComponent, reactive, toRefs, watch } from 'vue'
import { type IPickerState, props } from './props'

export default defineComponent({
  name: 'MvMultiPicker',
  components: {},
  inheritAttrs: false,
  props,
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const state: IPickerState = reactive({
      multiIndex: new Array(props.level).fill(0),
      range: new Array(props.level).fill(0).map(() => [])
    })

    const setRange = (children: Record<string, any>[], col = -1, row = -1) => {
      while (col < props.level - 1 && !!children) {
        col++
        state.range[col] = children
        state.multiIndex[col] = 0
        if (!children.length) {
          state.multiIndex[col] = -1
        }
        row = 0
        children = state.range[col][row]?.[props.conf.children] || []
      }
      state.multiIndex = [...state.multiIndex]
      state.range = JSON.parse(JSON.stringify(state.range))
    }

    setRange(props.data)

    watch(
      () => [props.level, props.data.length],
      () => {
        state.multiIndex = new Array(props.level).fill(0)
        state.range = new Array(props.level).fill(0).map(() => [])
        setRange(props.data)
      }
    )

    watch(
      () => props.modelValue,
      (arr) => {
        //根据默认值 回显
        let i = 0
        let list = props.data
        while (i < arr.length && !!list.length) {
          let index = list.findIndex((item) => {
            return item[props.conf.label] === arr[i]
          })
          index = index > 0 ? index : 0
          state.multiIndex[i] = index
          state.range[i] = list
          i++
          list = list[index]?.[props.conf.children] || []
        }
        state.multiIndex = [...state.multiIndex]
        state.range = JSON.parse(JSON.stringify(state.range))
      },
      {
        immediate: true
      }
    )

    const handleMultiChange = (e) => {
      const indexs = e.detail.value
      const lastIndex = indexs.length - 1
      //特殊处理 ,级别少的地方,eg:东莞
      if (indexs[lastIndex] === -1) {
        indexs.splice(-1, 1)
      }
      //角标换label
      const names: string[] = []
      const values: string[] = []
      indexs.forEach((j, i) => {
        const label = state.range[i][j]?.[props.conf.value]
        const name = state.range[i][j]?.[props.conf.label]
        if (label && name) {
          values.push(label)
          names.push(name)
        }
      })
      emit('update:modelValue', names)
      props?.onChange({
        names,
        values
      })
    }

    //列改变时触发
    const handleMultiColChange = (e) => {
      const col = e.detail.column
      const row = e.detail.value
      state.multiIndex[col] = row

      const children = state.range[col][row][props.conf.children]
      setRange(children, col, row)
    }

    return {
      ...toRefs(state),
      handleMultiChange,
      handleMultiColChange,
      setRange
    }
  }
})
</script>
<style lang="scss">
.mv-multi-picker {
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
