import { type Ref, unref } from 'vue'
import Taro from '@tarojs/taro'

export interface Rect {
  top: number
  left: number
  right: number
  bottom: number
  width: number
  height: number
}

function isWindow(val: unknown): val is Window {
  return typeof window !== 'undefined' && val === window
}

export const useTaroRectById = (id: string) => {
  return new Promise((resolve, reject) => {
    if (Taro.getEnv() === Taro.ENV_TYPE.WEB) {
      const t = document ? document.querySelector(`#${id}`) : ''
      if (t) {
        resolve(t?.getBoundingClientRect())
      }
      reject()
    } else {
      const query = Taro.createSelectorQuery()
      query
        .select(`#${id}`)
        .boundingClientRect()
        .exec(function (rect: any) {
          if (rect[0]) {
            resolve(rect[0])
          } else {
            reject()
          }
        })
    }
  })
}

/**
  获取元素的大小及其相对于视口的位置，等价于 Element.getBoundingClientRect。
   需要给dom设置唯一id属性，否则无法查询。
  @param elementRef -元素或元素的 ref
  @returns Promise<Rect>
 */
export const useRect = (
  elementRef: (Element | Window | any) | Ref<Element | Window | any>
): Promise<Rect> => {
  // 小程序下需要 el 具有 id 属性才能查询
  let element = unref(elementRef)
  return new Promise((resolve, reject) => {
    if (Taro.getEnv() === Taro.ENV_TYPE.WEB) {
      if (element && element.$el) {
        element = element.$el
      }
      if (isWindow(element)) {
        const width = element.innerWidth
        const height = element.innerHeight
        resolve({
          top: 0,
          left: 0,
          right: width,
          bottom: height,
          width,
          height
        })
      }
      if (element && element.getBoundingClientRect) {
        resolve(element.getBoundingClientRect())
      }
      reject()
    } else {
      const query = Taro.createSelectorQuery()
      const id = element?.id
      if (id) {
        query
          .select(`#${id}`)
          .boundingClientRect()
          .exec(function (rect) {
            if (rect[0]) {
              resolve(rect[0])
            } else {
              reject()
            }
          })
      } else {
        reject('useRect 需要 elementRef 具有 id 属性')
      }
    }
  })
}
