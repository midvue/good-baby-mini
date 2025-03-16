import { createApp, onMounted, provide, ref } from 'vue'
import { type JSX } from 'vue/jsx-runtime'
import Dialog from '../Dialog.vue'
import { type DialogPropsType } from '../props'

type DialogOptionType = Partial<InstanceType<typeof Dialog>> & {
  id?: string
  header?: (scoped: { show: () => void; close: () => void }) => string | null | JSX.Element
  render: (scoped: { show: () => void; close: () => void }) => string | null | JSX.Element
  footer?: (scoped: { show: () => void; close: () => void }) => string | null | JSX.Element
}

let instance = null // Notify 实例
let unmount: Function | null = null

export function showDialog(option: DialogOptionType) {
  if (instance) {
    //instance.close()
    unmount?.()
    instance = null
  }
  ;({ instance, unmount } = mountComponent(option))
  return instance
}

//挂载dom
function mountComponent(option = {} as DialogOptionType) {
  const { header, render, footer, id = 'popup', ...attrs } = option

  //获取root节点
  let page: HTMLDivElement | null = null
  let uid = ''
  const childNodes = document.getElementById('app')!.childNodes
  for (let length = childNodes.length, i = length - 1; i >= 0; i--) {
    const elt = childNodes[i]
    if (elt.nodeType === 1) {
      page = elt.lastChild! as HTMLDivElement
      //@ts-ignore
      uid = elt.uid
      break
    }
  }

  //初始化组件
  let app = createApp({
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
      if (footer) slots.footer = () => footer(scoped)

      return () => (
        <Dialog v-model={show.value} {...attrs} title={option.title}>
          {slots}
        </Dialog>
      )
    }
  })

  console.log(page, 2)

  //mount挂载
  const root = document.createElement('view', { is: id })
  console.log(root)

  const instance = app.mount(root)
  page!.appendChild(instance.$el)

  return {
    instance,
    unmount() {
      page.removeChild(instance.$el)
      app.unmount()
      app = null
    }
  }
}
