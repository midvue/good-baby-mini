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
        [`mv-button__${props.size}`]: true,
        ['mv-button__round']: props.round,
        ['mv-button__block']: props.block,
        [props.className]: true
      }
    })

    const handleClick = (event: CommonEvent) => {
      if (props.stopPropagation) {
        event.stopPropagation()
      }
      emit('click', event)
    }
    return { bType, handleClick, classes }
  }
})
</script>

<style lang="scss">
@import './index.scss';
</style>
