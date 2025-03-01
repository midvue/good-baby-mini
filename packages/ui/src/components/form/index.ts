import Form from './Form.vue'
import FormItem from './FormItem.vue'
import { useFormItem } from './useFormItem'
/**
 * 设置mid-vue-cell-form只读
 */
// export const useFormReadonly = (formConf: IFormItem[], disabled = true) => {
//   formConf.forEach((item) => {
//     if (item.component) {
//       if (item.component.attrs) {
//         item.component.attrs.disabled = disabled
//       } else {
//         item.component.attrs = reactive({ disabled: disabled })
//       }
//     }
//   })
// }

export * from './types'

export type FormInstance = InstanceType<typeof Form> & {
  validate: (names?: string | string[]) => Promise<boolean>
  reset: () => void
}

export { Form, FormItem, useFormItem }
