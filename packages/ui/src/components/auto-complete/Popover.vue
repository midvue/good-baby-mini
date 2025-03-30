<template>
  <transition :name="'mv-popover-zoom-' + position">
    <view
      v-show="modelValue"
      :catch-move="true"
      :style="state.style"
      :class="['mv-popover', 'mv-popover--' + position]"
    >
      <slot></slot>
    </view>
  </transition>
</template>
<script lang="ts">
import { type CSSProperties, type PropType, reactive, watch, defineComponent } from 'vue'

export default defineComponent({
  name: 'Popover',
  inheritAttrs: false,
  props: {
    modelValue: {
      type: Boolean,
      default: true
    },
    overlay: {
      type: Boolean,
      default: true
    },
    position: {
      type: String as PropType<'top' | 'bottom' | 'right' | 'left'>,
      default: 'top'
    },
    duration: {
      type: Number,
      default: 3000
    },
    height: {
      type: String,
      default: '30%'
    },
    offset: {
      type: [String, Number],
      default: 0
    }
  },
  emits: ['close', 'open', 'update:modelValue'],
  setup(props, { emit }) {
    const state = reactive({
      style: {
        animationduration: '0.3s'
      } as CSSProperties
    })

    watch(
      () => props.offset,
      () => {
        state.style[props.position] = 1 + Number(props.offset) + 'px'
      }
    )
    const close = () => {
      emit('close')
      emit('update:modelValue', false)
    }

    const open = () => {
      emit('open')
      emit('update:modelValue', true)
    }

    //点击蒙层
    const handleOverClick = () => {
      close()
    }

    return { state, open, close, handleOverClick }
  }
})
</script>

<style lang="scss">
$--el-transition-md-fade:
  transform 0.3s cubic-bezier(0.23, 1, 0.32, 1),
  opacity 0.3s cubic-bezier(0.23, 1, 0.32, 1);

.mv-popover {
  z-index: 10001;
  word-wrap: break-word;
  -webkit-overflow-scrolling: touch;
  position: absolute;
  background: var(--mv-white);
  transition: $--el-transition-md-fade;
  transform-origin: top;
  box-shadow: 0 0px 6px 0 rgba(0, 0, 0, 0.1);

  &--top {
    left: 0;
    width: 100%;
  }

  &--bottom {
    left: 0;
    width: 100%;
  }
}

.mv-popover-zoom-top {
  &-enter-from,
  &-leave-to {
    opacity: 0;
    transform: scaleY(0);
  }
}

.mv-popover-zoom-bottom {
  &-enter-from,
  &-leave-to {
    opacity: 0;
    transform: scaleY(0);
  }
}

.mv-popover-zoom-top,
.mv-popover-zoom-bottom {
  &-enter-active,
  &-leave-active {
    transition: $--el-transition-md-fade;
    transform-origin: top;
  }

  &-enter-to {
    opacity: 1;
    transform: scaleY(1);
  }
  &-leave-from {
    transform: translateZ(0);
  }
}
</style>
