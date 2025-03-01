import Drag from './Drag.vue'

export { Drag }

export default Drag

declare module 'vue' {
  interface GlobalComponents {
    MvRadio: typeof Drag
  }
}
