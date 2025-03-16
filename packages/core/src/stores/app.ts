import {
  clearToken,
  getEnvVersion,
  getMetaEnv,
  getToken,
  getUserInfo,
  setEnvVersion,
  setToken,
  setUserInfo
} from '@/utils'
import Http from '@mid-vue/http-client'
import Taro from '@tarojs/taro'
import { defineStore } from 'pinia'

interface IAppStore {
  userInfo: IUserInfo
  token: string
  /** 家庭id */
  familyId: number
  /** 是否登录 */
  isLogin: boolean
  nickname?: string
  metaEnv: MetaEnvType
  appId: string
  version: string
}

export const useAppStore = defineStore('app-store', {
  state: (): IAppStore => {
    const userInfo = getUserInfo()

    return {
      appId: '',
      version: '',
      metaEnv: getMetaEnv(),
      userInfo: userInfo,
      familyId: userInfo.familyId,
      token: getToken(),
      isLogin: !!getToken()
    }
  },
  actions: {
    /** 微信授权登录 */
    async wxLogin() {
      if (this.token) return
      let { code } = await Taro.login()
      const option = {
        url: '/app/account/wxLogin',
        data: { code }
      }
      let res = await Http.post<{ token: string }>(option)
      await this.setToken(res.token)
      this.getUseInfo()
    },

    setToken(this: IAppStore, token: string) {
      this.token = token
      this.isLogin = !!token
      return setToken(token)
    },

    async getUseInfo() {
      let userInfo = await Http.get<IUserInfo>({
        url: '/app/account/info'
      })
      this.familyId = userInfo.familyId
      this.userInfo = userInfo
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
      this.isLogin = false
      this.token = ''
      this.familyId = ''
      this.userInfo = {} as IUserInfo
      const envVersion = getEnvVersion()
      await clearToken()
      //环境不清除，否则会导致切换环境时，无法获取到环境变量
      setEnvVersion(envVersion)
    }
  }
})
