import Dialog from './Dialog.vue'
export * from './use/useDialog'

export { Dialog }
export default Dialog
declare module 'vue' {
  interface GlobalComponents {
    MvDialog: typeof Dialog
  }
}
