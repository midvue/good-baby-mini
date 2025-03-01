import { type ExtractPropTypes } from 'vue'
import { popupProps } from '../popup/props'

export const dialogProps = {
  ...popupProps,
  modelValue: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: '提示'
  },
  class: {
    type: String,
    default: ''
  },
  showHeader: {
    type: Boolean,
    default: true
  },
  showFooter: {
    type: Boolean,
    default: true
  },
  showClose: {
    type: Boolean,
    default: false
  },
  lazyLoad: {
    type: Boolean,
    default: true
  },

  showCancel: {
    type: Boolean,
    default: true
  },
  cancelText: {
    type: String,
    default: '取消'
  },
  confirmText: {
    type: String,
    default: '确定'
  }
}
export type DialogPropsType = ExtractPropTypes<typeof dialogProps>
