import Taro from '@tarojs/taro'

/** 展示loading */
export function showLoading(option?: Taro.showLoading.Option) {
  return Taro.showLoading(option)
}

/** 隐藏loading (不会关闭toast) */
export function hideLoading(option?: Taro.showLoading.Option) {
  return Taro.hideLoading({ noConflict: true, ...option })
}
