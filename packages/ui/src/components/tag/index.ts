import Tag from './Tag.vue'

export { Tag }

export default Tag

declare module 'vue' {
  interface GlobalComponents {
    MvTag: typeof Tag
  }
}
