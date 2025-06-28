import Taro from '@tarojs/taro'

/** 展示loading */
export function showLoading(option?: Taro.showLoading.Option) {
  return Taro.showLoading(
    option
      ? option
      : {
          title: '',
          mask: true
        }
  )
}

/** 隐藏loading (不会关闭toast) */
export function hideLoading(option?: Taro.showLoading.Option) {
  return Taro.hideLoading({ noConflict: true, ...option })
}

/** 展示Toast */
export function showToast(option?: Taro.showToast.Option | string) {
  if (typeof option === 'string') {
    return Taro.showToast({ title: option, icon: 'none', mask: true, duration: 2500 })
  }
  return Taro.showToast(option)
}
