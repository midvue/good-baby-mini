<template>
  <view class="mv-textarea" :class="[{ 'mv-input__clear': clearable }, $attrs.class]">
    <mv-icon v-if="prefixIcon" class="prefix-icon" :name="prefixIcon"></mv-icon>
    <textarea
      v-if="!disabled"
      v-bind="{ ...$attrs, class: inputClass }"
      :disabled="disabled"
      :value="modelValue"
      @input="handleInput"
      @focus="handleFocus"
      @blur="handleBlur"
      :maxlength="maxLength"
      :placeholder="placeholder"
      :autoHeight="autoHeight"
      :resize="resize"
    ></textarea>
    <mv-text v-else class="break-text">{{ modelValue }}</mv-text>
    <mv-icon v-if="suffixIcon" class="suffix-icon" :name="suffixIcon"></mv-icon>
    <mv-text v-if="showWordLimit" class="show-word-limit">{{
      `${modelValue.length}/${maxLength}`
    }}</mv-text>
    <mv-icon
      v-if="canClearable"
      class="mv-textarea-icon"
      name="close"
      @touchstart.stop="handleClear"
    ></mv-icon>
  </view>
</template>
<script lang="ts">
import { computed, ref, defineComponent } from 'vue'
import Text from '../text'
import Icon from '../icon'
import { textAreaProps } from './props'

export default defineComponent({
  name: 'MvTextarea',
  components: { mvText: Text, mvIcon: Icon },
  inheritAttrs: false,
  props: textAreaProps,
  emits: ['update:modelValue', 'clear', 'input'],
  setup(props, { emit }) {
    const isEmpty = ref(!props.modelValue)
    const isFocus = ref(false)
    let hasClear = false

    //监听显示清空icon条件c
    const canClearable = computed(() => {
      return !isEmpty.value && props.clearable && isFocus.value
    })

    const handleInput = (e) => {
      const value = e.target.value
      emit('update:modelValue', value)
      isEmpty.value = !value && value !== 0
      emit('input', e)
    }

    const handleFocus = (e) => {
      const value = e.target.value
      isEmpty.value = !value && value !== 0
      isFocus.value = true
    }

    const handleBlur = (e) => {
      isFocus.value = false

      //解决微信input框,Input不回调问题
      const value = e.target.value
      emit('update:modelValue', value)

      //解决blur先触发删不掉
      if (hasClear) {
        isEmpty.value = true
        emit('update:modelValue', '')
        emit('clear', '')
        hasClear = false
      }
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
.mv-textarea {
  position: relative;
  line-height: 20px;
  width: 100%;
  font-size: 14px;
  text-align: left;
  display: flex;
  background: #f6f6fd;
  border-radius: 6px;
  padding: 14px 14px 0;
  height: 90px;
  &__clear {
    display: flex;
    align-items: center;
  }
  .textarea-placeholder {
    color: #b5b3be;
  }
  .prefix-icon,
  .suffix-icon {
    vertical-align: middle;
    margin: 0 5px;
    font-size: inherit;
  }

  .mv-textarea-icon {
    color: var(--mv-text-color);
    padding: 0px 5px 1px 6px;
    font-size: 20px;
    cursor: pointer;
  }

  .h5-textarea {
    height: 100%;
  }

  .weui-input {
    height: 100%;
  }

  .break-text {
    word-break: break-all;
    line-height: initial;
    padding: 10px 0;
  }

  .show-word-limit {
    position: absolute;
    bottom: 5px;
    right: 10px;
    font-size: 12px;
    color: #b5b3be;
    // background-color: #fff;
  }
}
</style>
