<template>
  <Transition name="toast-fade" @after-leave="onAfterLeave">
    <view
      v-show="visible"
      :class="toastBodyClass"
      :style="{
        bottom: center ? 'auto' : bottom,
        'background-color': coverColor
      }"
      @click="clickCover"
    >
      <template v-if="$slots.default">
        <slot></slot>
      </template>
      <template v-else>
        <view
          class="mv-toast-inner"
          :style="{
            'text-align': textAlignCenter ? 'center' : 'left',
            'background-color': bgColor
          }"
        >
          <div v-if="title" class="mv-toast-title">
            {{ title }}
          </div>
          <view class="mv-toast-text" v-html="msg"></view>
        </view>
      </template>
    </view>
  </Transition>
</template>
<script lang="ts">
import { computed, watch, defineComponent } from 'vue'
import { toastProps } from './props'
export default defineComponent({
  name: 'MvToast',
  inheritAttrs: false,
  props: toastProps,
  emits: ['update:visible', 'closed'],
  setup(props, { emit }) {
    let timer: number | null = null
    const clearTimer = () => {
      if (timer) {
        clearTimeout(timer)
        timer = null
      }
    }
    const hide = () => {
      emit('update:visible', false)
      emit('closed')
    }
    const show = () => {
      clearTimer()
      if (props.duration) {
        timer = window.setTimeout(() => {
          hide()
        }, props.duration)
      }
    }
    const clickCover = () => {
      if (props.closeOnClickOverlay) {
        hide()
      }
    }

    watch(
      () => props.visible,
      (val) => {
        if (val) {
          show()
        }
      }
    )

    const hasIcon = computed(() => {
      if (props.type !== 'text') {
        return true
      } else {
        return !!props.icon
      }
    })

    const toastBodyClass = computed(() => {
      return [
        'mv-toast',
        { 'mv-toast-center': props.center },
        { 'mv-toast-has-icon': hasIcon.value },
        { 'mv-toast-cover': props.cover },
        { 'mv-toast-loading': props.type === 'loading' },
        props.customClass,
        'mv-toast-' + props.size
      ]
    })

    const onAfterLeave = () => {
      if (props.visible) {
        clearTimer()
        hide()
      }
    }

    return {
      clickCover,
      hasIcon,
      toastBodyClass,
      onAfterLeave
    }
  }
})
</script>

<style lang="scss">
@import './index.scss';
</style>
