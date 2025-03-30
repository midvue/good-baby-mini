<template>
  <Transition name="overlay-fade">
    <view
      v-show="visible"
      :class="classes"
      :style="style"
      :catch-move="lockScroll"
      @click="onClick"
    >
      <slot></slot>
    </view>
  </Transition>
</template>
<script setup lang="ts">
import { type CSSProperties, computed } from 'vue'

defineOptions({
  name: 'MvOverlay'
})

export type OverlayProps = Partial<{
  visible: boolean
  zIndex: string | number
  duration: string | number
  lockScroll: boolean
  overlayClass: string
  overlayStyle: CSSProperties
  closeOnClickOverlay: boolean
}>

const props = withDefaults(defineProps<OverlayProps>(), {
  visible: false,
  zIndex: 10000,
  duration: 0.3,
  lockScroll: true,
  overlayClass: '',
  closeOnClickOverlay: true
})

const emit = defineEmits(['click', 'update:visible'])

const classes = computed(() => {
  const prefixCls = 'mv-overlay'
  return {
    [prefixCls]: true,
    [props.overlayClass]: true
  }
})

const style = computed(() => {
  return {
    transitionDuration: `${props.duration}s`,
    zIndex: props.zIndex,
    ...props.overlayStyle
  }
})

const onClick = (e: MouseEvent) => {
  emit('click', e)
  if (props.closeOnClickOverlay) {
    emit('update:visible', false)
  }
}
</script>
<style lang="scss">
@import './index.scss';
</style>
