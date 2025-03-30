import { type ExtractPropTypes, type PropType } from 'vue'

export const popupProps = {
  modelValue: {
    type: Boolean,
    default: false
  },
  zIndex: {
    type: Number,
    default: 10000
  },
  position: {
    type: String as PropType<'top' | 'bottom' | 'right' | 'left' | 'center'>,
    default: 'bottom',
    validator(value: string) {
      // 这个值必须匹配下列字符串中的一个
      return ['top', 'bottom', 'right', 'left', 'center'].includes(value)
    }
  },
  duration: {
    type: Number,
    default: 0.3
  },
  lockScroll: {
    type: Boolean,
    default: true
  },
  closeOnClickOverlay: {
    type: Boolean,
    default: true
  },
  destroyOnClose: {
    type: Boolean,
    default: true
  },
  height: {
    type: String,
    default: '30%'
  },
  offset: {
    type: [String, Number],
    default: 0
  },
  catchMove: {
    type: Boolean,
    default: true
  },

  bgColor: {
    type: String
  },
  transition: {
    type: String
  },
  safeAreaInsetBottom: {
    type: Boolean,
    default: true
  },

  overlay: {
    type: Boolean,
    default: true
  },
  overlayClass: {
    type: String,
    default: ''
  },
  overlayStyle: {
    type: Object,
    default: () => ({})
  },
  style: {
    type: Object,
    default: () => ({})
  },
  popupClass: {
    type: String,
    default: ''
  },
  class: {
    type: String,
    default: ''
  },
  teleport: {
    type: [String, Element],
    default: 'body'
  },
  round: {
    type: Boolean,
    default: false
  },
  /** 是否需要隐藏底部tabBar */
  hideTabBar: {
    type: Boolean,
    default: true
  },
  /** 弹窗标题 */
  title: String,
  /** 是否展示头部 */
  showHeader: {
    type: Boolean,
    default: true
  },
  /** 是否展示关闭按钮 */
  showClose: {
    type: Boolean,
    default: true
  }
}

export type PopupPropsType = ExtractPropTypes<typeof popupProps>
