import { type PropType } from "vue";

export interface PropsConf {
  label: string;
  children: string;
  level: number;
  value: string;
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

  conf: {
    type: Object as PropType<PropsConf>,
    default: () => {
      return { label: "name", children: "list", value: "code" };
    },
  },
  level: {
    type: Number,
    default: 3,
  },
  placeholder: {
    type: String,
    default: "--请选择--",
  },
  onChange: {
    type: Function as PropType<(arg: any) => void>,
    default: () => ({}),
  },
};
