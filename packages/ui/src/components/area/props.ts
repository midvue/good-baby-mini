export const areaProps = {
  /** 默认激活 */
  activeValue: {
    type: [String, Number],
    default: ''
  },
  /** 展示层级，最多3级(省/市/区) */
  level: {
    type: Number,
    default: 3
  },
  /** 是否展示底部按钮 */
  showFooter: {
    type: Boolean,
    default: true
  },
  /** 是否展示头部按钮 */
  showHeader: {
    type: Boolean,
    default: true
  },
  /** 限制选择指定区域 */
  limit: {
    type: Boolean,
    default: false
  }
}
