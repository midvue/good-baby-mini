import { type PropType } from 'vue'
import { type CommonEvent, type InputProps } from '@tarojs/components'
export type InputType = keyof InputProps.Type

export const inputProps = {
  modelValue: {
    type: [String, Number, null],
    required: true,
    default: ''
  },
  type: {
    type: String as PropType<InputType>
  },
  inputClass: {
    type: String,
    default: ''
  },
  clearable: {
    type: Boolean,
    default: true
  },
  suffixIcon: {
    type: String,
    default: ''
  },
  prefixIcon: {
    type: String,
    default: ''
  },
  formatter: {
    type: Function as PropType<(value: string | number) => string | number>,
    default: undefined
  },
  disabled: {
    type: Boolean,
    default: false
  },
  placeholder: String,
  maxlength: [Number, String],

  textAlign: {
    type: String as PropType<'left' | 'right'>,
    default: 'left'
  },
  append: {
    type: String
  },
  onInput: {
    type: Function as PropType<(value: CommonEvent) => void>
  },
  focus: {
    type: Boolean,
    default: false
  },
  /** 失焦时，不改变值(处理聚集打开下拉框，点击选择时部分手机先改变值后触发blur导致数据没有回填上问题) */
  limitBlurChangeValue: {
    type: Boolean,
    default: false
  }
}
