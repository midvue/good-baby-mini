import { defineStore } from 'pinia'
import { useHttp } from '@mid-vue/http-client'
import {
  clearStorage,
  getEnvVersion,
  getMetaEnv,
  getToken,
  getUserInfo,
  setEnvVersion,
  setToken,
  setUserInfo
} from '@/utils'

interface IAppStore {
  userInfo: IUserInfo
  token: string
  /** 是否登录 */
  isLogin: boolean
  nickname?: string
  metaEnv: MetaEnvType
  appId: string
  version: string
}
interface ICustomerResp {
  customerId: string
  /** 客户编码 */
  customerCode: string
  customerShortName: string
  /** 销售名字 */
  marketName: string
  /**销售电话 */
  marketPhone: string
}

export const useAppStore = defineStore('app-store', {
  state: (): IAppStore => {
    const userInfo = getUserInfo()

    return {
      appId: '',
      version: '',
      metaEnv: getMetaEnv(),
      userInfo: userInfo,
      token: getToken(),
      isLogin: !!getToken()
    }
  },
  actions: {
    wxLogin() {},

    setToken(this: IAppStore, token: string) {
      this.token = token
      this.isLogin = !!token
      return setToken(token)
    },

    setUseInfo(this: IAppStore, userInfo: IUserInfo) {
      const token = userInfo.token
      this.userInfo = userInfo
      this.mobile = userInfo.mobile
      this.token = token
      this.isLogin = !!token
      this.isBindCode = !!userInfo.customerCode
      setToken(userInfo.token)
      return setUserInfo(userInfo)
    },

    /**
     * 刷新token
     * 10分钟只执行一次
     */
    refreshToken() {
      const { refreshToken, token } = this.userInfo
      if (!token) return
      // useHttp<IUserInfo>({
      //   token: () => '',
      //   url: 'mid-vue.cargo.wet.refreshToken',
      //   data: { refreshToken }
      // }).then((res) => {
      //   const userInfo = this.userInfo
      //   userInfo.token = res.accessToken
      //   userInfo.accessToken = res.accessToken
      //   userInfo.refreshToken = res.refreshToken
      //   userInfo.refreshTokenEffectiveTime = res.refreshTokenEffectiveTime
      //   userInfo.tokenEffectiveTime = res.tokenEffectiveTime
      //   this.setUseInfo(userInfo)
      // })
    },

    async logout(this: IAppStore) {
      if (!getToken()) {
        return
      }
      try {
        await useHttp<ICustomerResp>({
          url: 'mid-vue.cargo.wet.logout',
          data: { token: this.token }
        })
      } finally {
        this.isLogin = false
        this.token = ''
        this.userInfo = {} as IUserInfo
        const envVersion = getEnvVersion()
        clearStorage()
        //环境不清除，否则会导致切换环境时，无法获取到环境变量
        setEnvVersion(envVersion)
      }
    }
  }
})
