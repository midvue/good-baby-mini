import { inject, provide } from 'vue'
import Taro from '@tarojs/taro'

interface IConfigProvide {
  top: number
  /** 胶囊的宽度 */
  boundingWidth: number
  statusBarHeight: number
  navBarHeight: number
  /** navbar可视宽度 */
  navBarWidth: number
  /** 可使用窗口宽度 */
  windowWidth: number
  windowHeight: number
  screenHeight: number
  model: string
  homeUrl?: string
}

export const CONFIG_PROVIDER_KEY = Symbol('configProvider')

export const useConfigProvider = (homeUrl?: string) => {
  if (Taro.getEnv() !== Taro.ENV_TYPE.WEB) {
    /** 获取胶囊的数据
     * height 胶囊本身高度
     * top  上边界坐标 (胶囊距离顶部的高度)
     */
    const { height, top, width, left } = Taro.getMenuButtonBoundingClientRect() //获取胶囊对象
    const {
      statusBarHeight = 20,
      windowHeight,
      screenHeight,
      model,
      windowWidth
    } = Taro.getSystemInfoSync() // 获取状态栏高度
    const navBarHeight = statusBarHeight + height + (top - statusBarHeight) * 2

    provide(CONFIG_PROVIDER_KEY, {
      screenHeight,
      model,
      statusBarHeight,
      navBarWidth: left,
      navBarHeight,
      windowWidth,
      windowHeight,
      top,
      homeUrl,
      boundingWidth: width
    })
  } else {
    provide<IConfigProvide>(CONFIG_PROVIDER_KEY, {
      top: 0,
      statusBarHeight: 0,
      navBarHeight: 40,
      navBarWidth: window.innerWidth,
      windowHeight: window.innerHeight,
      windowWidth: window.innerWidth,
      screenHeight: window.screen.height,
      model: window.navigator.userAgent,
      homeUrl,
      boundingWidth: 0
    })
  }
}
/** 获取系统数据 */
export const getConfigProvider = () => {
  return inject<IConfigProvide>(CONFIG_PROVIDER_KEY, {
    statusBarHeight: 0,
    navBarWidth: 0,
    navBarHeight: 40,
    top: 0,
    homeUrl: '',
    model: '',
    windowWidth: 0,
    windowHeight: 0,
    screenHeight: 0,
    boundingWidth: 0
  })
}
