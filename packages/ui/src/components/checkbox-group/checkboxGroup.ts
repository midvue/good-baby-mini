import { type PropType } from 'vue'

export interface IOption {
  label?: string
  value?: string | number
  disabled?: boolean
  readonly?: boolean
  [key: string]: string | number | boolean | undefined
}

export type TMode = 'horizontal' | 'vertical'

export interface ICheckboxGroupState {
  values: (string | number | boolean)[]
  options: IOption[]
}

export const checkboxGroupProps = {
  modelValue: {
    type: Array as PropType<(string | number | boolean)[]>,
    default: () => []
  },
  options: {
    type: Array as PropType<IOption[]>,
    default: () => []
  },

  mode: {
    type: String as PropType<TMode>,
    default: 'horizontal'
  },

  labelKey: {
    type: String,
    default: 'label'
  },

  valuekey: {
    type: String,
    default: 'value'
  },

  disabled: {
    type: Boolean,
    default: false
  },
  readonly: {
    type: Boolean,
    default: false
  },
  onChange: {
    type: Function as PropType<(value: IOption) => void>
  }
}
