import Picker from './Picker.vue'
export default Picker

export { Picker }

declare module 'vue' {
  interface GlobalComponents {
    MvPicker: typeof Picker
  }
}
