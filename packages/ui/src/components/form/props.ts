import { type PropType } from 'vue'
import { EnumLabelAlign, type EnumLabelAlignType } from './dict'
import { type IFormItem, type IRule, type ItemClickEvent, type RequiredType } from './types'

export const formProps = {
  cells: {
    type: Array as PropType<IFormItem[]>,
    default: () => []
  },
  data: {
    type: Object,
    default: () => ({})
  },
  requiredType: {
    type: String as PropType<RequiredType>,
    default: 'text'
  },
  readonly: {
    type: Boolean,
    default: false
  },
  validateFirst: {
    type: Boolean,
    default: true
  },
  labelAlign: {
    type: String as PropType<EnumLabelAlignType>,
    default: EnumLabelAlign.LEFT
  },
  labelWidth: {
    type: String
  },
  onItemClick: {
    type: Function as PropType<(event: ItemClickEvent) => void>
  }
}

/** formItem 的props */
export const formItemProps = {
  field: {
    type: String,
    default: ''
  },
  label: {
    type: String
  },
  required: {
    type: [Boolean, Function],
    default: false
  },
  /** 必填标签的类型 */
  requiredType: {
    type: String as PropType<RequiredType>,
    default: ''
  },
  labelWidth: {
    type: String
  },
  labelClass: {
    type: String
  },
  labelAlign: {
    type: String as PropType<EnumLabelAlignType>,
    default: EnumLabelAlign.LEFT
  },
  rules: {
    type: Array as PropType<IRule[]>
  },
  /** 显示右边箭头 */
  rightArrow: {
    type: Boolean,
    default: false
  }
}
