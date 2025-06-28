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
  screenWidth: number
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
      screenWidth,
      screenHeight,
      model,
      windowWidth
    } = Taro.getSystemInfoSync() // 获取状态栏高度
    const navBarHeight = statusBarHeight + height + (top - statusBarHeight) * 2
    const systemInfo = {
      screenWidth,
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
    }
    provide(CONFIG_PROVIDER_KEY, systemInfo)
    Taro.setStorage({
      key: CONFIG_PROVIDER_KEY.description!,
      data: systemInfo
    })
  } else {
    const systemInfo = {
      top: 0,
      statusBarHeight: 0,
      navBarHeight: 40,
      navBarWidth: window.innerWidth,
      windowHeight: window.innerHeight,
      windowWidth: window.innerWidth,
      screenWidth: window.screen.width,
      screenHeight: window.screen.height,
      model: window.navigator.userAgent,
      homeUrl,
      boundingWidth: 0
    }
    provide<IConfigProvide>(CONFIG_PROVIDER_KEY, systemInfo)
    Taro.setStorage({
      key: CONFIG_PROVIDER_KEY.description!,
      data: systemInfo
    })
  }
}

export const setConfigProviderStore = (systemInfo: IConfigProvide) => {
  Taro.setStorage({
    key: CONFIG_PROVIDER_KEY.description!,
    data: systemInfo
  })
}
export const getConfigProviderStore = () => {
  return Taro.getStorageSync(CONFIG_PROVIDER_KEY.description!)
}

/** 获取系统数据 */
export const getConfigProvider = () => {
  return inject<IConfigProvide>(CONFIG_PROVIDER_KEY, getConfigProviderStore())
}
