import { type ComponentPublicInstance, createApp, onMounted, provide, ref } from 'vue'
import { type JSX } from 'vue/jsx-runtime'
import Popup from '../Popup.vue'
import { type PopupPropsType } from '../props'

type PopupOptionType = Partial<PopupPropsType> & {
  id?: string
  header?: (scoped: { show: () => void; close: () => void }) => string | null | JSX.Element
  render: (scoped: { show: () => void; close: () => void }) => string | null | JSX.Element
}

let instance: ComponentPublicInstance | null = null //Notify 实例
let unmount: Function | null = null

export function showPopup(option: PopupOptionType) {
  if (instance) {
    //instance.close()
    unmount?.()
    instance = null
  }
  ;({ instance, unmount } = mountComponent(option))
  return instance
}

//挂载dom
function mountComponent(option = {} as PopupOptionType) {
  const { header, render, id = 'popup', ...attrs } = option

  //获取root节点
  let page: HTMLDivElement | null = null
  let uid = ''
  const childNodes = document.getElementById('app')!.childNodes
  for (let length = childNodes.length, i = length - 1; i >= 0; i--) {
    const elt = childNodes[i] as ChildNode & { uid: string }
    if (elt.nodeType === 1 && !elt.uid.startsWith('custom-tab-bar/index')) {
      page = elt.lastChild! as HTMLDivElement
      //@ts-ignore
      uid = elt.uid
      break
    }
  }

  //初始化组件
  const app = createApp({
    setup() {
      const show = ref(false)
      onMounted(() => {
        show.value = true
      })

      provide('id', uid)
      const scoped = {
        show: () => (show.value = true),
        close: () => (show.value = false)
      }
      const slots = {} as Record<string, Function>
      if (header) slots.header = () => header(scoped)
      if (render) slots.default = () => render(scoped)

      return () => (
        <Popup v-model={show.value} {...attrs} title={option.title}>
          {slots}
        </Popup>
      )
    }
  })
  //mount挂载
  const root = document.createElement('view', { is: id })

  const instance = app.mount(root)

  page!.appendChild(instance.$el)

  return {
    instance,
    unmount() {
      page!.removeChild(instance.$el)
      app.unmount()
      page = null
    }
  }
}
