<template>
  <view :class="classes" :style="style" @click="onClick">
    <slot></slot>
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
@import '../styles/hairline';
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
    &::before {
      border-color: $border-color;
    }
  }
  .mv-tag--plain {
    &.mv-tag--#{$label} {
      background-color: transparent;
      color: $color;
      &::before {
        border-color: $border-color;
      }
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
  padding: 5px 8px;
  flex: none;
  @extend %hairline--surround;

  &--close {
    margin-left: 4px;
    cursor: pointer;
  }

  &--large {
    padding: 8px 10px;
    border-radius: 6px;
  }
  &--small {
    padding: 2px 6px;
    border-radius: 6px;
  }
  &--mini {
    padding: 1px 3px;
    border-radius: 6px;
    transform: scale(0.8, 0.8);
  }

  &--round {
    border-radius: 999px;
  }
  &--round:before {
    content: '';
    border-radius: 999px;
  }
}
</style>
