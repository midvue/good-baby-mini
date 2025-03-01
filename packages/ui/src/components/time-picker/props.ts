import { type PropType } from "vue";

export interface PropsConf {
  label: string;
  children: string;
  level: number;
}

export interface IPickerState {
  multiIndex: number[];
  range: Array<Record<string, any>[]>;
}

export const props = {
  modelValue: {
    required: true,
    type: Array as PropType<Array<number | string>>,
    default: () => [],
  },
  data: {
    type: Array as PropType<Record<string, any>[]>,
    default: () => [],
  },
  labelKey: {
    type: String,
    default: "label",
  },

  valueKey: {
    type: String,
    default: "value",
  },

  level: {
    type: Number,
    default: 2,
  },

  placeholder: {
    type: String,
    default: "--请选择--",
  },
  maxDay: {
    type: Number,
    default: 30,
  },
};
