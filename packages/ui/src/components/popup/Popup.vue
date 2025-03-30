<template>
  <view>
    <mv-overlay
      v-if="overlay"
      :visible="modelValue"
      :close-on-click-overlay="closeOnClickOverlay"
      :z-index="zIndex"
      :lock-scroll="lockScroll"
      :duration="duration"
      :overlay-class="overlayClass"
      :overlay-style="overlayStyle"
      v-bind="$attrs"
      @click="onClickOverlay"
    />
    <Transition :name="transitionName" @after-enter="onOpened" @after-leave="onClosed">
      <view v-show="modelValue" :class="classes" :style="popStyle" @click="onClick">
        <div class="mv-popup-header" v-if="showHeader">
          <slot name="header">
            <div class="mv-popup-header__title">{{ title }}</div>
          </slot>
        </div>
        <mv-icon
          name="mv-icon-cross"
          class="mv-popup__close-icon mv-popup__close-icon--top-right"
          v-if="showClose"
          @click="onClickCloseIcon"
        ></mv-icon>
        <slot v-if="showSlot"></slot>
        <SafeBottom v-if="position === 'bottom' && safeAreaInsetBottom"></SafeBottom>
      </view>
    </Transition>
  </view>
</template>
<script lang="ts">
import { computed, defineComponent, reactive, toRefs, watch } from 'vue'
import Icon from '../icon/Icon.vue'
import mvOverlay from '../overlay'
import SafeBottom from '../safe-bottom'
import { popupProps } from './props'

const initIndex = 10000
let _zIndex = initIndex

export default defineComponent({
  components: {
    mvOverlay,
    mvIcon: Icon,
    SafeBottom
  },
  inheritAttrs: false,
  props: popupProps,
  emits: [
    'clickPop',
    'clickCloseIcon',
    'open',
    'close',
    'opened',
    'closed',
    'clickOverlay',
    'update:modelValue'
  ],

  setup(props, { emit }) {
    let opened: boolean
    const state = reactive({
      zIndex: props.zIndex,
      showSlot: true
    })

    const classes = computed(() => {
      const prefixCls = 'mv-popup'
      return {
        [prefixCls]: true,
        ['round']: props.round,
        [`mv-popup--${props.position}`]: true,
        [props.popupClass]: true,
        [props.class]: true
      }
    })

    const popStyle = computed(() => {
      return {
        zIndex: state.zIndex,
        transitionDuration: `${props.duration}s`,
        height: props.height,
        ...props.style
      }
    })

    const transitionName = computed(() => {
      return props.transition ? props.transition : `mv-popup-slide-${props.position}`
    })

    const open = () => {
      if (!opened) {
        opened = true
        if (props.zIndex !== initIndex) {
          _zIndex = Number(props.zIndex)
        }
        emit('update:modelValue', true)
        state.zIndex = ++_zIndex
        if (props.destroyOnClose) {
          state.showSlot = true
        }
        emit('open')
      }
    }

    const close = () => {
      if (opened) {
        opened = false
        emit('update:modelValue', false)
        emit('close')
        if (props.destroyOnClose) {
          setTimeout(() => {
            state.showSlot = false
          }, +props.duration * 1000)
        }
      }
    }

    const onClick = (e: Event) => {
      emit('clickPop', e)
    }

    const onClickCloseIcon = (e: Event) => {
      e.stopPropagation()
      emit('clickCloseIcon', e)
      close()
    }

    const onClickOverlay = (e: Event) => {
      emit('clickOverlay', e)
      if (props.closeOnClickOverlay) {
        close()
      }
    }

    const onOpened = (el: Element) => {
      emit('opened', el)
    }

    const onClosed = (el: Element) => {
      emit('closed', el)
    }

    watch(
      () => props.modelValue,
      () => {
        if (props.modelValue && !opened) {
          open()
        }
        if (!props.modelValue && opened) {
          close()
        }
      },
      {
        immediate: true
      }
    )

    return {
      ...toRefs(state),
      popStyle,
      transitionName,
      classes,
      onClick,
      onClickCloseIcon,
      onClickOverlay,
      onOpened,
      onClosed,
      open,
      close
    }
  }
})
</script>
<style lang="scss">
@import './index.scss';
</style>
