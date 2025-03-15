<template>
  <transition name="notify-fade">
    <view
      v-show="state.show"
      :style="['animationduration: 0.2s;', 'top:' + offset + 'px']"
      :class="['mv-notify', 'mv-notify--top', 'mv-notify--' + type]"
    >
      <text>{{ message }}</text>
    </view>
  </transition>
</template>
<script>
import { reactive } from 'vue'
export default {
  name: 'MvNotify',
  props: {
    type: {
      type: String,
      default: 'danger'
    },
    message: {
      type: String,
      default: ''
    },
    duration: {
      type: Number,
      default: 3000
    },
    offset: {
      type: [Number, String],
      default: 34
    }
  },
  setup(props, { expose }) {
    const state = reactive({
      show: false
    })

    const close = () => {
      state.show = false
    }

    const open = () => {
      state.show = true
    }
    expose({ open, close })
    return { state, open, close }
  }
}
</script>

<style lang="scss">
.mv-notify {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px 18px;
  color: var(--mv-white);
  font-size: 14px;
  line-height: 20px;
  position: fixed;
  max-height: 100%;
  overflow-y: auto;
  white-space: pre-wrap;
  text-align: center;
  word-wrap: break-word;
  z-index: 2000;
  transition: transform 0.2s;
  -webkit-overflow-scrolling: touch;

  &--top {
    top: 0;
    left: 0;
    width: 100%;
  }

  &--bottom {
    bottom: 0;
    left: 0;
    width: 100%;
  }

  &--danger {
    background: var(--mv-danger-color);
  }

  &--warning {
    background: var(--mv-warning-color);
  }
  &--success {
    background: var(--mv-success-color);
  }

  &--primary {
    background: var(--mv-primary-color);
  }
}
.notify-fade-enter-from,
.notify-fade-leave-to {
  transform: translate3d(0, -100%, 0);
}

.notify-fade-enter-active,
.notify-fade-leave-active {
  transition: transform 0.2s ease-out;
}

.notify-fade-enter-to,
.notify-fade-leave-from {
  transform: translate3d(0, 0, 0);
}
</style>
