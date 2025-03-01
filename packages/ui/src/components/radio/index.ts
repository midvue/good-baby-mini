import Radio from './Radio.vue'

export { Radio }

export default Radio

declare module 'vue' {
  interface GlobalComponents {
    MvRadio: typeof Radio
  }
}
