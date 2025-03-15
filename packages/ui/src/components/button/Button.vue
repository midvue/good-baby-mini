<template>
  <ButtonCore
    v-bind="$attrs"
    :type="bType"
    :loading="loading"
    @tap="handleClick"
    :plain="plain"
    :disabled="disabled"
    :open-type="openType"
    @getphonenumber="onGetPhonenumber"
    :class="classes"
  >
    <slot></slot>
  </ButtonCore>
</template>
<script lang="ts">
import { computed, defineComponent } from 'vue'
import { Button as ButtonCore, type CommonEvent } from '@tarojs/components'
import { buttonProps } from './props'

export default defineComponent({
  name: 'MvButton',
  components: { ButtonCore },
  inheritAttrs: false,
  props: buttonProps,
  emits: ['click'],
  setup(props, { emit }) {
    const bType = computed(() => {
      return `mv-${props.type}` as any
    })

    const classes = computed(() => {
      const prefixCls = 'mv-button'
      return {
        [prefixCls]: true,
        ['mv-button__round']: props.round,
        [`mv-button__${props.size}`]: true,
        [props.class]: true
      }
    })

    const handleClick = (event: CommonEvent) => {
      event.stopPropagation()
      emit('click', event)
    }
    return { bType, handleClick, classes }
  }
})
</script>

<style lang="scss">
$types:
  (
    label: 'primary',
    color: var(--mv-primary-color)
  ),
  (
    label: 'success',
    color: var(--mv-success-color)
  ),
  (
    label: 'warning',
    color: var(--mv-warning-color)
  ),
  (
    label: 'warn',
    color: var(--mv-warning-color)
  ),
  (
    label: 'danger',
    color: var(--mv-danger-color)
  ),
  (
    label: 'info',
    color: var(--mv-info-color)
  );

button,
taro-button-core {
  @each $type in $types {
    $label: map-get($type, label);
    $color: map-get($type, color);
    &[type='mv-#{$label}'] {
      color: var(--mv-white);
      background-color: $color;
      &::after {
        border-color: $color;
      }
    }
    &[plain][type='mv-#{$label}'] {
      background-color: transparent;
      color: $color;
      border: 1px solid $color;
    }
  }
}
.mv-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  padding: 0;
  margin: 0;
  line-height: inherit;
  overflow: unset;
  flex: none;
  background-color: #fff;
  border-radius: 8px;
  &__round {
    border-radius: 999px;
  }
  &__round:after {
    border-radius: 999px;
  }
  &:not([disabled]):active {
    opacity: 0.7;
  }
  &[disabled] {
    opacity: 0.6;
  }
  &[type='mv-default'][disabled] {
    color: var(--mv-black);
  }

  &[plain][type='mv-default'] {
    background-color: var(--mv-white);
    color: var(--mv-title-color);
    border: 1px solid var(--mv-border-color);
  }
}

.mv-button__large {
  height: 44px;
  width: 100%;
  border-radius: 8px;
}
.mv-button__medium {
  height: 44px;
  width: 140px;
}
.mv-button__small {
  height: 40px;
  width: 100px;
}

.mv-button__mini {
  height: 28px;
  padding: 0 5px;
  border-radius: 2px;
  font-size: 15px;
  & + & {
    margin-left: 8px;
  }
}

button::after {
  display: none;
}
</style>
