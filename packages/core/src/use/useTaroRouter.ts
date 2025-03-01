/**
 * 路由统一处理
 */
import Taro, { useRouter, useUnload } from '@tarojs/taro'

/**
 * 跳转到 tabBar 页面，并关闭其他所有非 tabBar 页面
 * @param  option - 参数
 */
export const switchTab = (option: INavOption) => {
  const { path: url, complete, fail, success, event } = option
  if (event) {
    const path = url.startsWith('/') ? url.substring(1) : url
    Taro.eventCenter.trigger(path.split('?')[0], event)
  }
  return Taro.switchTab({ url, complete, fail, success })
}

/**
 * 跳转到新的页面
 */
export const navigateTo = (option: INavOption) => {
  const { path, query } = option
  const args = objToUrl(query)
  if (!args) return Taro.navigateTo({ url: path, ...option })
  if (path.includes('?')) {
    return Taro.navigateTo({ url: path + '&' + args, ...option })
  }
  return Taro.navigateTo({ url: path + '?' + args, ...option })
}

/**
 * 关闭所有页面，打开到应用内的某个页面
 */
export const reLaunch = (option: INavOption) => {
  const { path, query } = option
  const args = objToUrl(query)
  if (!args) return Taro.reLaunch({ url: path })
  if (path.includes('?')) {
    return Taro.reLaunch({ url: path + '&' + args })
  }
  return Taro.reLaunch({ url: path + '?' + args })
}

/**
 * 关闭当前页面，跳转到应用内的某个页面。但是不允许跳转到 tabbar 页面。
 */
export const redirectTo = (option: INavOption) => {
  const { path, query } = option
  const args = objToUrl(query)
  if (!args) return Taro.redirectTo({ url: path })
  if (path.includes('?')) {
    return Taro.redirectTo({ url: path + '&' + args })
  }
  return Taro.redirectTo({ url: path + '?' + args })
}

/**
 * 关闭当前页面，返回上一页面或多级页面
 * 默认返回一层
 */
export const navigateBack = (option = {} as Partial<INavOption>) => {
  //切面pages
  const pages = Taro.getCurrentPages()
  const { delta = 1, event } = option || {}

  if (option.path) {
    //历史堆栈
    const pageIndex = pages.findIndex((page) => {
      const path = page.route || page.path.split('?')[0]
      return option.path === '/' + path
    })
    //页面不存在,没有打开过
    if (pageIndex === -1) {
      const tabBarList = Taro.getApp().config.tabBar.list as any[]
      const isTabBar = tabBarList.some((tabBar) => {
        return option.path === '/' + tabBar.pagePath
      })
      //tabBar页面,就switchTab
      if (isTabBar) {
        return switchTab(option as INavOption)
      }
      return reLaunch(option as INavOption)
    } else {
      //如果历史存在，则返回指定页面
      option.delta = pages.length - pageIndex - 1
      if (event) {
        Taro.eventCenter.trigger(option.path.substring(1), event)
      }
      return Taro.navigateBack(option as INavOption)
    }
  } else {
    const at = pages.length - delta - 1
    //如果没有path,而且超出堆栈长度,则返回首页
    if (at < 0) {
      option.path = ENV_HOME_URL
      return reLaunch(option as INavOption)
    }
    const prePage = pages[at]
    if (event) {
      const path = prePage.route || prePage.path.split('?')[0]
      Taro.eventCenter.trigger(path, event)
    }
    return Taro.navigateBack(option)
  }
}

/**
 * 检查堆栈是否有对应页面,
 * 存在就返回指定页面
 * 不存在就跳转新页面
 */
export const navigateToOrBack = (option = {} as Partial<INavOption>) => {
  //切面pages
  const pages = Taro.getCurrentPages()

  if (!option.path) return Promise.reject('navigateToOrBack path is required')

  //历史堆栈
  const pageIndex = pages.findIndex((page) => {
    const path = page.route || page.path.split('?')[0]
    return option.path === '/' + path
  })
  //页面不存在,没有打开过
  if (pageIndex === -1) {
    const tabBarList = Taro.getApp().config.tabBar.list as any[]
    const isTabBar = tabBarList.some((tabBar) => {
      return option.path === '/' + tabBar.pagePath
    })
    //tabBar页面,就switchTab
    if (isTabBar) {
      return switchTab(option as INavOption)
    }
    return navigateTo(option as INavOption)
  } else {
    //如果历史存在，则返回指定页面
    option.delta = pages.length - pageIndex - 1
    if (option.event) {
      Taro.eventCenter.trigger(option.path.substring(1), option.event)
    }
    return Taro.navigateBack(option as INavOption)
  }
}

/** 获取当前页面参数 */
export const useRoute = <T = Record<string, string | Record<string, any>>>() => {
  const { params, path } = useRouter()
  const cPath = path.split('?')[0].substring(1)
  return { path: cPath, query: decodeObj(params) as T }
}

export const useTaroEvent = () => {
  const { path, query } = useRoute()

  /**
   * @param fun - 监听发送到当前页面的数据
   */
  const onRefresh = (fun: (args: INavOption['event']) => void) => {
    Taro.eventCenter.on(path, fun)
  }

  /**
   * @param args - 发送到页面的数据
   */
  const refresh = (option: { path?: string; event: INavOption['event'] }) => {
    Taro.eventCenter.trigger(option.path || path, option.event)
  }

  useUnload(() => {
    Taro.eventCenter.off(path)
  })

  return {
    path,
    query,
    refresh,
    onRefresh
  }
}

/**
 * 对象类型参数 转url
 * @returns
 */
const objToUrl = (query?: Record<string, string>) => {
  if (!query) return ''
  //对象转成url 参数，只支持两层对象
  let args = ''
  for (const key in query) {
    if (Object.prototype.hasOwnProperty.call(query, key)) {
      let value = query[key]
      if (value === 'undefined' || value === undefined) continue
      if (value === null) value = '' //处理null会被转换null字符串
      let _key = key
      if (typeof value === 'object') {
        value = JSON.stringify(value)
        _key = `${key}_is__obj_`
      }
      args += `&${_key}=${value}`
    }
  }
  return args.slice(1)
}

/**
 * 对象特殊字符 decode
 * @returns
 */
const decodeObj = (query: Partial<Record<string, string>>) => {
  //对象转成url 参数，只支持两层对象
  const obj = {} as Record<string, string | Record<string, any>>
  for (const key in query) {
    if (Object.prototype.hasOwnProperty.call(query, key)) {
      if (key === 'stamp' || key === '$taroTimestamp') continue
      let value = decodeURIComponent(query[key] || '')
      let _key = key
      if (key.endsWith('_is__obj_')) {
        try {
          value = JSON.parse(value)
        } catch (error) {
          value = JSON.parse(decodeURIComponent(value))
        }
        _key = key.split('_is__obj_')[0]
      }

      obj[_key] = value
    }
  }
  return obj
}
