import { type PropType } from 'vue'

export type PositionProperty = 'absolute' | 'fixed' | 'relative' | 'static' | 'sticky'

export enum EnumTheme {
  /**
   * 高亮主题
   */
  Light = 'light',
  Dark = 'dark',
  DEFAULT = 'default'
}

export const props = {
  title: {
    type: String,
    default: ''
  },
  leftArrow: {
    type: Boolean,
    default: true
  },
  showHome: {
    type: Boolean,
    default: true
  },
  leftClass: {
    type: String,
    default: ''
  },
  position: {
    type: String as PropType<PositionProperty>,
    default: 'fixed'
  },
  /** 默认主题色配置 */
  defaultConfig: {
    type: Object as PropType<Taro.setNavigationBarColor.Option & { title?: string }>,
    default: { frontColor: '#000000', backgroundColor: 'transparent', title: '' }
  },
  /** 滑动之后主题色配置 */
  scrolledConfig: {
    type: Object as PropType<Taro.setNavigationBarColor.Option & { title?: string }>,
    default: { frontColor: '#000000', backgroundColor: '#fff', title: '' }
  },
  /** 改版主题的指定滑动距离 */
  scrolledHeight: {
    type: Number,
    default: 20
  },

  clearfix: {
    type: Boolean,
    default: true
  },
  autoTheme: {
    type: Boolean,
    default: false
  },
  onBack: {
    type: Function,
    default: undefined
  },
  onHome: {
    type: Function,
    default: undefined
  },
  autoBounding: {
    type: Boolean,
    default: false
  }
}
