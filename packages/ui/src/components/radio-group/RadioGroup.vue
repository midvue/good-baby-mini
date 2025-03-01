<template>
  <view class="mv-radio-group">
    <view v-for="(item, index) in options" :key="index" class="mv-radio" @click="onChange(item)">
      <icon
        class="mv-radio-icon"
        :color="colorFilter(item.value)"
        :type="item.value === modelValue ? 'success' : 'circle'"
        size="23"
      ></icon>
      <view class="mv-radio-label">{{ item.text }}</view>
    </view>
  </view>
</template>
<script lang="ts">
import { useFormItem } from '../form'
export default defineComponent({
  name: 'MvRadioGroup',
  inheritAttrs: false,
  props: {
    modelValue: {
      type: [String, Number, null, Boolean],
      required: true,
      default: ''
    },
    options: {
      type: Array,
      default: () => []
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update:modelValue', 'change'],
  setup(props, { emit }) {
    const { validateWithTrigger, setValidateValue } = useFormItem()
    setValidateValue(props.modelValue)

    const onChange = (e) => {
      if (props.disabled) return
      emit('update:modelValue', e.value)
      emit('change', e)
      validateWithTrigger('change', e.value)
    }
    const colorFilter = (value) => {
      if (props.disabled) return '#E1E1E1'
      if (value === props.modelValue) return '#1c78ef'
      return ''
    }
    return { onChange, colorFilter }
  }
})
</script>

<style lang="scss">
.mv-radio-group {
  display: flex;
  align-items: center;
  height: 100%;
  .mv-radio {
    display: inline-flex;
    align-items: center;

    &-icon {
      width: 23px;
      flex: none;
      height: 23px;
    }
    &-label {
      margin-left: 3px;
    }
    &:nth-child(2) {
      margin-left: 15px;
    }
    .weui-icon-circle,
    .weui-icon-success {
      &::before {
        margin-right: 0;
      }
    }
  }
}
</style>
