<template>
  <picker-view
    class="mv-picker-view"
    :value="[pickerIndex]"
    :indicatorStyle="indicatorStyle"
    :maskClass="maskClass"
    :indicatorClass="indicatorClass"
    v-bind="$attrs"
    @change="handleChange"
  >
    <picker-view-column>
      <View
        class="mv-picker-view-item"
        v-for="(item, index) in range"
        :key="item[valueKey] + '_' + index"
      >
        <slot name="item" :item="item">
          {{ item[rangeKey] }}
        </slot>
      </View>
    </picker-view-column>
  </picker-view>
</template>
<script lang="ts">
import { CommonEvent, PickerView, PickerViewColumn, View } from '@tarojs/components'
import { defineComponent, onMounted, PropType, ref, watch } from 'vue'
export default defineComponent({
  name: 'MvPickerView',
  inheritAttrs: false,
  components: { PickerView, PickerViewColumn, View },
  props: {
    modelValue: {
      type: [String, Number],
      default: ''
    },
    range: {
      type: Array as PropType<(any | Record<string, any>)[]>,
      default: () => []
    },
    rangeKey: {
      type: String,
      default: 'name'
    },
    valueKey: {
      type: String,
      default: 'code'
    },
    maskClass: [String],
    indicatorStyle: [String],
    indicatorClass: [String],
    disabled: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update:modelValue', 'change'],
  setup(props, { emit }) {
    const pickerIndex = ref(0)
    const pickerLabel = ref()

    watch(
      () => props.modelValue,
      () => {
        setPickerIndex()
      }
    )
    const setPickerIndex = () => {
      const key = props.valueKey || props.rangeKey
      const index = props.range.findIndex((item) => {
        const i = key ? item[key] : item
        return i === props.modelValue
      })
      pickerIndex.value = index < 0 ? 0 : index
    }

    onMounted(() => {
      setPickerIndex()
    })

    const handleChange = (e: CommonEvent) => {
      const index = e.detail.value
      pickerIndex.value = index
      const key = props.valueKey || props.rangeKey
      emit(
        'update:modelValue',
        key ? props.range[pickerIndex.value][key] : props.range[pickerIndex.value]
      )
      emit('change', e, props.range[index])
    }
    return {
      pickerLabel,
      pickerIndex,
      handleChange
    }
  }
})
</script>
<style lang="scss">
.mv-picker-view {
  width: 100%;
  .mv-picker-view-item {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: var(--mv-font-size-3);
    font-weight: bold;
  }
}
</style>
