import { type PropType } from 'vue'

export interface IPickerState {
  start: number
  end: number
  multiIndex: number[]
  range: { label: string; value: number }[][]
}

export const props = {
  modelValue: {
    required: true,
    type: [String, Number],
    default: () => ''
  },

  start: {
    type: [String, Number],
    default: ''
  },
  end: {
    type: [String, Number],
    default: ''
  },
  placeholder: {
    type: String,
    default: '--请选择--'
  },
  labelFormat: {
    type: Array as PropType<string[]>,
    default: () => ['YYYY-MM-DD', 'HH', 'mm']
  },

  valueFormat: {
    type: String,
    default: 'YYYY-MM-DD HH:mm'
  },
  onChange: {
    type: Function as PropType<(arg: any) => void>,
    default: () => ({})
  }
}
