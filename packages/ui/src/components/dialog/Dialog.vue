<template>
  <mv-popup
    v-model="showRef"
    position="center"
    :catch-move="catchMove"
    :show-header="false"
    :popup-class="popClass"
    :show-close="showClose"
    :destroy-on-close="destroyOnClose"
    height="auto"
  >
    <template #default>
      <slot name="header" v-if="showHeader">
        <view class="mv-dialog-header">{{ title }}</view>
      </slot>
      <view class="mv-dialog-content" :catch-move="true">
        <slot></slot>
      </view>
      <slot name="footer" v-if="showFooter">
        <view class="mv-dialog-footer">
          <mv-button class="dialog-btn-cancel" @click.stop="handleCancel" v-if="showCancel">
            {{ cancelText }}
          </mv-button>
          <slot name="confirm">
            <mv-button class="dialog-btn-confirm" @click.stop="handleConfirm">
              {{ confirmText }}
            </mv-button>
          </slot>
        </view>
      </slot></template
    >
  </mv-popup>
</template>
<script lang="ts">
import { computed, defineComponent } from 'vue'
import Button from '../button'
import Popup from '../popup'
import { dialogProps } from './props'

export default defineComponent({
  name: 'MvDialog',
  components: { 'mv-button': Button, mvPopup: Popup },
  inheritAttrs: false,
  props: dialogProps,
  emits: ['update:modelValue', 'confirm', 'close', 'open', 'cancel'],
  setup(props, { emit }) {
    const showRef = computed({
      set: (modelValue) => {
        emit('update:modelValue', modelValue)
      },
      get: () => {
        return props.modelValue
      }
    })

    const close = () => {
      emit('close')
      emit('update:modelValue', false)
    }

    const open = () => {
      emit('open')
      emit('update:modelValue', true)
    }

    //取消
    const handleCancel = () => {
      close()
      emit('cancel')
    }

    //确定
    const handleConfirm = () => {
      close()
      emit('confirm')
    }

    const popClass = computed(() => {
      return `mv-dialog ${props.class}`
    })
    return {
      showRef,
      popClass,
      open,
      close,
      handleCancel,
      handleConfirm
    }
  }
})
</script>

<style lang="scss">
@import './index.scss';
</style>
