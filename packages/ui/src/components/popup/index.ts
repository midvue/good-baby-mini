import Popup from './Popup.vue'

export { Popup }

export * from './use'

export default Popup

declare module 'vue' {
  interface GlobalComponents {
    MvPopup: typeof Popup
  }
}
