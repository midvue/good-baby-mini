<template>
  <view class="mv-radio" @click.stop="onChange">
    <mvImage
      class="mv-radio-icon"
      mode="aspectFit"
      :src="modelValue ? 'order/icon-radio-success.png' : 'order/icon-radio.png'"
    ></mvImage>
    <view v-if="$slots.default?.()" class="mv-radio-label">
      <slot></slot>
    </view>
  </view>
</template>
<script>
import { Image } from '../image'
export default {
  name: 'MvRadio',
  components: { mvImage: Image },
  inheritAttrs: false,
  props: {
    modelValue: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    size: {
      type: [Number, String],
      default: 23
    }
  },
  emits: ['update:modelValue', 'change'],
  setup(props, { emit }) {
    const onChange = () => {
      if (props.disabled) return
      emit('update:modelValue', !props.modelValue)
      emit('change', !props.modelValue)
    }
    return { onChange }
  }
}
</script>

<style lang="scss">
.mv-radio {
  display: flex;
  align-items: center;
  height: 100%;

  &-icon {
    width: 18px;
    flex: none;
    height: 18px;
  }

  &-label {
    margin-left: 3px;
    height: 100%;
    display: flex;
    align-items: center;
  }

  .weui-icon-circle,
  .weui-icon-success {
    &::before {
      margin-right: 0;
    }
  }
}
</style>
