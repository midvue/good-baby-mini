import { type CommonEvent } from '@tarojs/components'
import { type JSX } from 'vue/jsx-runtime'
import { type EnumLabelAlignType } from './dict'

interface ItemComponent {
  name?: string
  attrs?: {
    required?: boolean
    border?: boolean
    class?: string
    onInput?: (value: CommonEvent) => any
    onClick?: (event: CommonEvent) => any
    [key: string]: string | boolean | Function | undefined
  }
}

export type RuleTrigger = 'blur' | 'change' | 'focus'

export type RuleMessage = string | ((value: any, rule: IRule) => string)

export type RuleValidator = (
  value: any,
  rule: IRule
) => boolean | string | Promise<boolean | string>

export type ValidateError = {
  name?: string
  message: string
}

/** 校验规则 */
export type IRule = {
  required?: boolean
  pattern?: RegExp
  message?: RuleMessage
  trigger?: RuleTrigger | RuleTrigger[]
  validator?: RuleValidator
}

export type ItemClickEvent = CommonEvent<{
  $index: number
  [key: string]: any
}>

type DeepKeyOf<T> = T extends Function
  ? never
  : T extends object
    ? {
        [K in keyof T]-?: K extends string ? K | `${K}.${DeepKeyOf<T[K]>}` : never
      }[keyof T]
    : never

export interface IFormItem<T = Record<string, any>> {
  /**
   * 字段名
   */
  field?: T extends Object ? DeepKeyOf<T> : string
  label?: string | (() => JSX.Element | string)
  show?: () => boolean
  component?: ItemComponent | ((field: keyof T) => JSX.Element | string | null)
  rules?: IRule[]
  render?: (field?: keyof T, index?: number) => JSX.Element | string | null
  attrs?: {
    /** 是否显示必填 */
    required?: boolean | (() => boolean)
    /** 下边框 */
    border?: boolean
    class?: string
    /** label宽度,0px则隐藏label */
    labelWidth?: string
    labelClass?: string
    /** 右边箭头 */
    rightArrow?: boolean
    /** label对齐,top顶部对齐 */
    labelAlign?: EnumLabelAlignType
    /** 点击回馈效果 */
    clickable?: true
    onClick?: (event: ItemClickEvent) => any
    [key: string]: string | boolean | undefined | Function
  }
  children?: IFormItem<T>[]
  slots?: Record<string, Function>
}

export type RequiredType = 'TAG' | 'TEXT'
