<template>
  <picker class="mv-picker" :value="pickerIndex" v-bind="$attrs" @change="handleChange">
    <slot></slot>
    <template v-if="!$slots.default">
      <text>{{ pickerLabel }}</text>
    </template>
  </picker>
</template>
<script>
import { ref, onMounted, watch, defineComponent } from 'vue'
export default defineComponent({
  name: 'MvPicker',
  inheritAttrs: false,
  props: {
    modelValue: {
      type: [String, Number],
      default: ''
    },
    valueKey: {
      type: String,
      default: ''
    }
  },
  emits: ['update:modelValue', 'change'],
  setup(props, { attrs, emit }) {
    const pickerIndex = ref(0)
    const pickerLabel = ref(null)

    watch(
      () => props.modelValue,
      () => {
        if (attrs.mode === 'selector') {
          // REVIEW: 这里暂时注释掉 - Tim
          // if (props.modelValue) {
          setPickerIndex()
          setPickerLabel()
          // }
        } else {
          if (props.modelValue) {
            pickerLabel.value = props.modelValue
          }
        }
      }
    )
    const setPickerIndex = () => {
      const key = props.valueKey || attrs.rangeKey
      const index = attrs.range.findIndex((item) => {
        const i = key ? item[key] : item
        return i === props.modelValue
      })
      pickerIndex.value = index < 0 ? 0 : index
    }
    const setPickerLabel = () => {
      pickerLabel.value = attrs.rangeKey
        ? attrs.range[pickerIndex.value][attrs.rangeKey]
        : attrs.range[pickerIndex.value]
    }
    onMounted(() => {
      if (attrs.mode === 'selector') {
        if (props.modelValue) {
          setPickerIndex()
          setPickerLabel()
        } else if (!attrs.hasOwnProperty('value') && attrs?.range?.[pickerIndex.value]) {
          setPickerLabel()
          const key = props.valueKey || attrs.rangeKey

          emit(
            'update:modelValue',
            key ? attrs.range[pickerIndex.value][key] : attrs.range[pickerIndex.value]
          )
        }
      } else {
        if (props.modelValue) {
          pickerLabel.value = props.modelValue
        }
      }
    })

    const handleChange = (e) => {
      const index = e.detail.value
      if (attrs.mode === 'selector') {
        pickerIndex.value = index
        setPickerLabel()
        const key = props.valueKey || attrs.rangeKey

        emit(
          'update:modelValue',
          key ? attrs.range[pickerIndex.value][key] : attrs.range[pickerIndex.value]
        )
        emit('change', e, attrs.range[index])
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
