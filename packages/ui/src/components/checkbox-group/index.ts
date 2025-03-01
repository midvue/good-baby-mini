import CheckboxGroup from './CheckboxGroup.vue'
import Checkbox from './Checkbox.vue'

export { CheckboxGroup, Checkbox }

export default Checkbox

export * from './types'

declare module 'vue' {
  interface GlobalComponents {
    MvCheckbox: typeof Checkbox
    MvCheckboxGroup: typeof CheckboxGroup
  }
}
