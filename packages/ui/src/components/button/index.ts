import Button from './Button.vue'

export { Button }

export * from './types'

export default Button

declare module 'vue' {
  interface GlobalComponents {
    MvButton: typeof Button
  }
}
