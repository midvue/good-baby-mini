import { type ComponentPublicInstance } from 'vue'
import { type Rect } from '@/use/useRect'
import FooterBar from './FooterBar.vue'

export { FooterBar }

export type FooterBarInstance = ComponentPublicInstance<
  InstanceType<typeof FooterBar>,
  { getRect: () => Promise<Rect> }
>

export default FooterBar
