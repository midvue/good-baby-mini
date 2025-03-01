import '@/assets/icon/iconfont.css'
import { createApp } from 'vue'
import Taro from '@tarojs/taro'
import { createPinia } from 'pinia'
import Http, { defaultInterceptors, type HttpResponse } from '@mid-vue/http-client'
import { throttle } from '@mid-vue/shared'
import { useConfigProvider } from '@mid-vue/taro-h5-ui'
import './app.scss'
import { EnumChannelType, EnumEnvVersion } from './dict'
import { clearStorage, getEnvVersion, getMetaEnv, getToken, setEnvVersion } from './utils'

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
    if (Taro.getEnv() === Taro.ENV_TYPE.WEB) return
    // 入口组件不需要实现 render 方法，即使实现了也会被 taro 所覆盖
    const updateManager = Taro.getUpdateManager()
    updateManager.onCheckForUpdate(function (res) {
      // 请求完新版本信息的回调
      console.log('是否有新版本', res.hasUpdate)
    })
    updateManager.onUpdateReady(function () {
      Taro.showModal({
        title: '更新提示',
        content: '新版本已经准备好，是否重启应用？',
        confirmColor: '#8365F6',
        success: function (res) {
          if (res.confirm) {
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            updateManager.applyUpdate()
          }
        }
      })
    })
    updateManager.onUpdateFailed(function () {
      Taro.showToast({
        title: '更新失败',
        icon: 'none',
        duration: 3000
      })
    })
  }
  // 入口组件不需要实现 render 方法，即使实现了也会被 taro 所覆盖
})

App.use(createPinia())

// 节流,防止多次跳转登录页
const navigateToLogin = throttle(
  (res: HttpResponse) => {
    clearStorage()
    Taro.reLaunch({
      url: '/pages/login/index'
    }).then(() => {
      Taro.showToast({
        title: res.data.msg || '登录失效，请重新登录',
        icon: 'none'
      })
    })
  },
  1000 * 5,
  false
)

//初始化配置
Http.init({
  baseURL: getMetaEnv().BASE_URL,
  token: () => getToken(),
  headers: {
    'X-associated-system-code': EnumChannelType.WE_CHAT
  },
  interceptors: {
    response: [defaultInterceptors().response],
    rejectResponse: (res: HttpResponse) => {
      if ([60010, 100201, 16113].includes(res?.data?.code)) {
        navigateToLogin(res)
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

export default App
