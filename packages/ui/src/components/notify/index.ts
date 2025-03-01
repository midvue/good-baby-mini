import { createApp } from 'vue'
import Notify from './Notify.vue'

let timer: number | null = null
let instance: InstanceType<typeof Notify> | null = null //Notify 实例
let unmount: Function | null = null
//默认参数

/**
 * 打开notify
 * @param {String | Object} args  参数
 * @param {String} type
 */
const open = (args, type) => {
  if (!args) {
    console.warn('mvNotify args need a String or Object')
    return
  }

  let option = {
    type: type || args?.type,
    duration: 2000 //显示时长
  }
  if (typeof args === 'string') {
    args = args.replace(/<\/br>/g, '\r\n')
    option = Object.assign(option, { message: args })
  } else {
    option = Object.assign({}, option, args)
  }
  //如果存在，旧销毁
  //todo 性能可以提升
  if (instance) {
    instance.close()
    instance = null
    unmount?.()
  }
  //清除时间
  if (timer) {
    clearTimeout(timer)
    timer = null
  }
  ;({ instance, unmount } = mountComponent(Notify, option))

  instance!.open()

  //duration时间后自动销毁notify
  if (option.duration) {
    timer = window.setTimeout(() => {
      instance.close()
      instance = null
      unmount?.()
    }, option.duration)
  }
}

//挂载dom
function mountComponent(RootComponent: typeof Notify, option: Record<string, any>) {
  //初始化组件
  let app = createApp(RootComponent, option)

  //获取root节点
  let body: ChildNode | null = null
  document.getElementById('app')!.childNodes.forEach((elt) => {
    //获取TaroRootElement
    if (elt.nodeType === 1) {
      body = elt.lastChild
    }
  })

  //mount挂载
  const root = document.createElement('view')
  const instance = app.mount(root)
  body!.appendChild(instance.$el)

  return {
    instance: instance,
    unmount() {
      //body.removeChild(instance.$el);
      //app.unmount();
      app = null
    }
  }
}
/**
 * 暴露mvNotify 全局 用$mvNotify
 * 使用 mvNotify.success('请求成功')
 */
export const mvNotify = {
  success: (option) => open(option, 'success'),
  danger: (option) => open(option, 'danger'),
  warning: (option) => open(option, 'warning'),
  primary: (option) => open(option, 'primary')
}

export default mvNotify
