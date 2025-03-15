import '@/assets/icon/iconfont.css'
import Http, { defaultInterceptors, type HttpResponse } from '@mid-vue/http-client'
import { throttle } from '@mid-vue/shared'
import { useConfigProvider } from '@mid-vue/taro-h5-ui'
import Taro from '@tarojs/taro'
import { createPinia } from 'pinia'
import { createApp } from 'vue'
import './app.scss'
import { EnumEnvVersion } from './dict'
import { useAppStore } from './stores'
import { initDict, useUpdateManager } from './use'
import { getEnvVersion, getMetaEnv, getToken, setEnvVersion } from './utils'

if (Taro.getEnv() !== Taro.ENV_TYPE.WEB) {
  const { miniProgram } = Taro.getAccountInfoSync()
  if (miniProgram.envVersion === EnumEnvVersion.RELEASE) {
    setEnvVersion(EnumEnvVersion.RELEASE)
  } else {
    let env = getEnvVersion()
    if (!env || env === EnumEnvVersion.RELEASE) {
      env = EnumEnvVersion.UAT
    }
    //开发版,体验版默认是uat环境
    setEnvVersion(env)
  }
} else {
  setEnvVersion(getEnvVersion() || EnumEnvVersion.UAT)
}

const App = createApp({
  setup() {
    useConfigProvider(ENV_HOME_URL)
    return {}
  },
  onShow() {
    useUpdateManager()
  }
  // 入口组件不需要实现 render 方法，即使实现了也会被 taro 所覆盖
})

App.use(createPinia())

let appStore = useAppStore()

// 节流,防止多次跳转登录页
const reLaunch = throttle(
  async () => {
    await appStore.logout()
    await appStore.wxLogin()
    Taro.reLaunch({
      url: '/pages/home/index'
    })
  },
  1000 * 5,
  false
)

//初始化配置
Http.init({
  baseURL: getMetaEnv().BASE_URL,
  token: () => getToken(),
  interceptors: {
    response: [defaultInterceptors().response],
    rejectResponse: (res: HttpResponse) => {
      if ([401, 403].includes(res?.data?.code)) {
        reLaunch()
      }
      return Promise.reject(res)
    }
  },
  showErrorMsg: (msg) =>
    Taro.showToast({
      title: msg,
      icon: 'none'
    })
})
appStore.wxLogin()
initDict()

export default App
