import PickerView from './PickerView.vue'
export default PickerView

export { PickerView }

declare module 'vue' {
  interface GlobalComponents {
    MvPickerView: typeof PickerView
  }
}
