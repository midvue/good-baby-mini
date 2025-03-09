<template>
  <picker
    class="mv-picker"
    :mode="mode"
    :range="range"
    :rangeKey="rangeKey"
    :value="pickerIndex"
    :disabled="disabled"
    :start="start"
    :end="end"
    v-bind="$attrs"
    @change="handleChange"
  >
    <slot></slot>
    <template v-if="!$slots.default">
      <text>{{ pickerLabel || '请选择' }}</text>
    </template>
  </picker>
</template>
<script lang="ts">
import { CommonEvent, Picker } from '@tarojs/components'
import { defineComponent, onMounted, PropType, ref, watch } from 'vue'
export default defineComponent({
  name: 'MvPicker',
  inheritAttrs: false,
  components: { Picker },
  props: {
    mode: {
      type: String as PropType<'selector' | 'multiSelector' | 'time' | 'date' | 'region'>,
      default: 'selector'
    },
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
      default: ''
    },
    valueKey: {
      type: String,
      default: ''
    },
    start: [String],
    end: [String],
    disabled: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update:modelValue', 'change'],
  setup(props, { attrs, emit }) {
    const pickerIndex = ref(0)
    const pickerLabel = ref()

    watch(
      () => props.modelValue,
      () => {
        if (attrs.mode === 'selector') {
          setPickerIndex()
          setPickerLabel()
        } else {
          if (props.modelValue) {
            pickerLabel.value = props.modelValue
          }
        }
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
    const setPickerLabel = () => {
      pickerLabel.value = props.rangeKey
        ? props.range[pickerIndex.value][props.rangeKey]
        : props.range[pickerIndex.value]
    }
    onMounted(() => {
      if (props.mode === 'selector') {
        if (props.modelValue) {
          setPickerIndex()
          setPickerLabel()
        }
      } else {
        if (props.modelValue) {
          pickerLabel.value = props.modelValue
        }
      }
    })

    const handleChange = (e: CommonEvent) => {
      const index = e.detail.value
      if (attrs.mode === 'selector') {
        pickerIndex.value = index
        setPickerLabel()
        const key = props.valueKey || props.rangeKey
        emit(
          'update:modelValue',
          key ? props.range[pickerIndex.value][key] : props.range[pickerIndex.value]
        )
        emit('change', e, props.range[index])
      } else {
        pickerLabel.value = index
        emit('update:modelValue', pickerLabel.value)
        emit('change', e)
      }
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
.mv-picker {
  width: 100%;
}
</style>
