<template>
  <switch
    class="mv-switch"
    color="#8365f6"
    v-bind="$attrs"
    :checked="modelValue === activeValue"
    @change="onChange"
  >
  </switch>
  <slot></slot>
</template>
<script>
import { useFormItem } from '../form'

export default {
  name: 'MvSwitch',
  inheritAttrs: false,
  props: {
    modelValue: {
      type: [String, Number, Boolean],
      required: true,
      default: ''
    },
    /** 打开时的值 */
    activeValue: {
      type: [String, Number, Boolean],
      default: true
    },
    /** 关闭时的值 */
    inactiveValue: {
      type: [String, Number, Boolean],
      default: false
    }
  },
  emits: ['update:modelValue', 'change'],
  setup(props, { emit }) {
    const { validateWithTrigger, setValidateValue } = useFormItem()
    setValidateValue(props.modelValue)

    const onChange = (e) => {
      const value = e.detail.value ? props.activeValue : props.inactiveValue

      emit('update:modelValue', value)
      emit('change', value)
      validateWithTrigger('change', value)
    }
    return { onChange }
  }
}
</script>

<style lang="scss">
wx-switch .wx-switch-input {
  width: 47px;
  height: 26px;
  border-radius: 13px;
  &::before {
    background: #f6f6fd;
    width: 45px;
    height: 24px;
    border-radius: 12px;
  }
  &::after {
    height: 24px !important;
    width: 24px !important;
    border-radius: 12px;
  }
}
wx-switch .wx-switch-input.wx-switch-input-checked:after {
  transform: translateX(21px);
}
taro-switch-core {
  line-height: inherit;

  input {
    font-size: inherit;
    line-height: inherit;
  }
}
</style>
