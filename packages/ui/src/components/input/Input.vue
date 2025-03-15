<template>
  <view
    class="mv-input"
    :class="[{ 'mv-input__clear': clearable }, $attrs.class]"
    @click="$emit('click')"
  >
    <IconCore v-if="prefixIcon" class="prefix-icon" :name="prefixIcon"></IconCore>
    <input
      v-if="!disabled"
      v-bind="{ ...$attrs, class: inputClass }"
      :placeholder="placeholder"
      :disabled="disabled"
      :value="modelValue"
      :type="type"
      placeholder-class="mv-input__placeholder"
      @input="handleInput"
      @focus="handleFocus"
      @blur="handleBlur"
    />
    <TextCore v-else-if="modelValue" class="break-text">{{ modelValue }}</TextCore>
    <TextCore v-else class="break-text mv-input__placeholder">{{ placeholder }}</TextCore>
    <slot name="suffix"></slot>
    <span class="mv-input-icon-box" v-show="canClearable" @touchstart.stop="handleClear">
      <IconCore class="mv-input-icon" name="close"></IconCore>
    </span>
    <view class="mv-input-append" v-if="$slots.append || append">
      <slot name="append">{{ append }}</slot>
    </view>
  </view>
</template>
<script lang="ts">
import { computed, ref, watch, defineComponent } from 'vue'
import { Icon as IconCore } from '../icon'
import { Text as TextCore } from '../text'
import { useFormItem } from '../form'
import { inputProps } from './props'
export default defineComponent({
  name: 'MvInput',
  components: { IconCore, TextCore },
  inheritAttrs: false,
  props: inputProps,
  emits: ['update:modelValue', 'clear', 'input', 'click', 'focus', 'blur'],
  setup(props, { emit }) {
    const isEmpty = ref(!props.modelValue)
    const isFocus = ref(false)
    let hasClear = false

    const { validateWithTrigger, setValidateValue } = useFormItem()
    setValidateValue?.(props.modelValue)

    watch(
      () => props.modelValue,
      (val) => {
        let _val: string | number = String(val)
        //如果存在maxlength并且超出该限制
        if (props.maxlength && _val) {
          const _maxlength = parseInt(props.maxlength + '', 10)
          if (_maxlength < _val.length) {
            _val = _val.slice(0, _maxlength)
            if (!props.formatter) {
              emit('update:modelValue', _val)
            }
          }
        }
        //自定义formatter规则
        if (props.formatter) {
          _val = props.formatter(_val)
          emit('update:modelValue', _val)
        }
        validateWithTrigger?.('change', _val)
      }
    )

    //监听显示清空icon条件c
    const canClearable = computed(() => {
      return !isEmpty.value && props.clearable && isFocus.value
    })

    const handleInput = (e: Event) => {
      const value = (e.target as HTMLInputElement).value as string | number
      emit('update:modelValue', value)
      isEmpty.value = !value && value !== 0
      props.onInput?.(e)
    }

    const handleFocus = (e: Event) => {
      const value = (e.target as HTMLInputElement).value as string | number

      isEmpty.value = !value && value !== 0
      isFocus.value = true
      emit('focus', value)
      validateWithTrigger?.('focus', value)
    }

    const handleBlur = (e: Event) => {
      isFocus.value = false

      //解决微信input框,Input不回调问题
      const value = (e.target as HTMLInputElement).value
      !props.limitBlurChangeValue && emit('update:modelValue', value)

      //解决blur先触发删不掉
      if (hasClear) {
        isEmpty.value = true
        emit('update:modelValue', '')
        emit('clear', '')
        hasClear = false
      }
      emit('blur', value)
      validateWithTrigger?.('blur', value)
    }

    //清空回调
    const handleClear = () => {
      hasClear = true
    }
    return {
      handleInput,
      canClearable,
      handleClear,
      handleFocus,
      handleBlur,
      isFocus
    }
  }
})
</script>

<style lang="scss">
.mv-input {
  position: relative;
  width: 100%;
  font-size: 14px;
  text-align: v-bind(textAlign);
  display: flex;
  align-items: center;

  custom-wrapper {
    width: 100%;
  }

  &__clear {
    display: flex;
    align-items: center;
  }

  .prefix-icon {
    vertical-align: middle;
    margin-left: 0;
    margin-right: 8px;
    font-size: inherit;
  }
  .suffix-icon {
    vertical-align: middle;
    margin: 0 5px;
    font-size: inherit;
  }

  &-icon {
    color: var(--mv-text-color);
    padding: 0px 5px 1px 6px;
    font-size: 14px;
    cursor: pointer;
  }

  &-icon-box {
    padding-left: 2px;
    padding-right: 2px;
  }

  &-append {
    flex: none;
  }

  .h5-input {
    min-height: 44px;
    flex: 1;
    padding-right: 5px;
  }

  taro-input-core {
    width: 100%;
  }

  .weui-input {
    height: unset;
    line-height: inherit;
    min-width: 0;
    resize: none;
    &::-ms-clear {
      display: none;
    }
    &::-webkit-search-cancel-button {
      display: none;
    }
  }

  input {
    &::-webkit-input-placeholder,
    ::-moz-placeholder,
    :-moz-placeholder,
    :-ms-input-placeholder {
      color: var(--mv-placeholder-color);
    }

    &::-webkit-search-cancel-button {
      display: none;
    }
  }

  .mv-input__placeholder {
    color: var(--mv-placeholder-color);
  }

  .break-text {
    width: 100%;
    word-break: break-all;
    line-height: initial;
    padding: 10px 0;
    text-align: v-bind(textAlign);
  }
}
</style>
