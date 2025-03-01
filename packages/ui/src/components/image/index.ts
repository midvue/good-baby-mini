import Image from './Image.vue'

export { Image }
export default Image

declare module 'vue' {
  interface GlobalComponents {
    MvImage: typeof Image
  }
}
