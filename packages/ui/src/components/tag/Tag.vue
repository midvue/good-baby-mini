<template>
  <view :class="classes" :style="style" @click="onClick">
    <slot></slot>
    <image-core
      v-show="props.checkIcon && props.type === 'primary'"
      mode="aspectFill"
      src="order/icon-purple-check-2.png"
      class="icon-tag-bubble"
    />
  </view>
</template>

<script setup lang="ts">
import { type CSSProperties, computed } from 'vue'
import { Image as ImageCore } from '../image'

defineOptions({
  name: 'MvTag',
  components: {
    ImageCore
  }
})

export type TagProps = Partial<{
  color: string
  textColor: string
  type: 'primary' | 'success' | 'danger' | 'warning' | 'default'
  plain: boolean
  checkIcon: boolean
  round: boolean
  mark: boolean
  closeable: boolean
  disabled: boolean
  size: 'large' | 'medium' | 'small' | 'mini' | ''
}>

const props = withDefaults(defineProps<TagProps>(), {
  color: '',
  textColor: '',
  type: 'default',
  plain: false,
  checkIcon: false,
  round: false,
  mark: false,
  closeable: false,
  size: 'medium',
  disabled: false
})

const emits = defineEmits(['close', 'click'])

const classes = computed(() => {
  const prefixCls = 'mv-tag'
  return {
    [prefixCls]: true,
    [`${prefixCls}--${props.type}`]: props.type,
    [`${prefixCls}--${props.size}`]: props.size,
    [`${prefixCls}--plain`]: props.plain,
    [`${prefixCls}--round`]: props.round,
    [`${prefixCls}--mark`]: props.mark,
    [`${prefixCls}--disabled`]: props.disabled
  }
})

const style = computed<CSSProperties>(() => {
  const style: CSSProperties = {}
  if (props.textColor) {
    style.color = props.textColor
  } else if (props.color && props.plain) {
    style.color = props.color
  }
  if (props.plain) {
    style.background = '#fff'
    style.borderColor = props.color
  } else if (props.color) {
    style.background = props.color
  }
  return style
})

const onClick = (event: Event) => {
  if (props.disabled) return
  emits('click', event)
}
</script>
<style lang="scss">
$types:
  (
    label: 'primary',
    color: var(--mv-primary-color),
    border-color: var(--mv-primary-color)
  ),
  (
    label: 'success',
    color: var(--mv-success-color),
    border-color: var(--mv-success-color)
  ),
  (
    label: 'warning',
    color: var(--mv-warning-color),
    border-color: var(--mv-warning-color)
  ),
  (
    label: 'danger',
    color: var(--mv-danger-color),
    border-color: var(--mv-danger-color)
  ),
  (
    label: 'default',
    color: var(--mv-info-color),
    border-color: var(--mv-border-color)
  );

@each $type in $types {
  $label: map-get($type, label);
  $color: map-get($type, color);
  $border-color: map-get($type, border-color);
  .mv-tag--#{$label} {
    color: var(--mv-white);
    background-color: $color;
    &::after {
      border-color: var(--mv-border-color);
    }
  }
  .mv-tag--plain {
    &.mv-tag--#{$label} {
      background-color: transparent;
      color: $color;
      border: 1px solid var(--mv-border-color);
    }
    &.mv-tag--disabled {
      background-color: #f3f4f6;
      border: 1px solid #d7d7db;
      color: #868392;
    }
  }
}

.mv-tag {
  position: relative;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  border-radius: var(--mv-tag-border-radius);
  font-size: 12px;
  padding: 5px 9px;
  flex: none;
  &.mv-tag--primary {
    font-weight: bold;
    background-color: #f5f3ff !important;
  }
  &--close {
    margin-left: 4px;
    cursor: pointer;
  }

  &--large {
    padding: 8px 10px;
    border-radius: 6px;
  }
  &--small {
    padding: 2px 4px;
    border-radius: 6px;
  }
  &--mini {
    padding: 1px 3px;
    border-radius: 6px;
    transform: scale(0.7, 0.7);
  }

  .icon-tag-bubble {
    position: absolute;
    right: -1px;
    bottom: -1px;
    width: 12px;
    height: 9px;
  }
}
</style>
