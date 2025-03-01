import { defineStore } from 'pinia'
import { useHttp } from '@mid-vue/http-client'
import { throttle } from '@mid-vue/shared'
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
import { type EnumPayMode } from '@/dict'

interface IAppStore {
  userInfo: IUserInfo
  token: string
  /** 是否登录 */
  isLogin: boolean
  /** 是否绑码 */
  isBindCode: boolean
  /** 是否进入第三方h5 */
  isIntoH5: boolean
  mobile: string
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
  /** 结算方式（crm_finance_pay_mode）(可以为空)10-现结，20-周结，30-半月结，40-月结 */
  payMode: EnumPayMode
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
      isLogin: !!getToken(),
      isBindCode: !!userInfo.customerCode,
      isIntoH5: false,
      mobile: userInfo.mobile
    }
  },
  actions: {
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

    setIntoH5(this: IAppStore, isIntoH5: boolean) {
      this.isIntoH5 = isIntoH5
    },

    /**
     * 刷新token
     * 10分钟只执行一次
     */
    refreshToken() {
      const { refreshToken, token } = this.userInfo
      if (!token) return
      useHttp<IUserInfo>({
        token: () => '',
        url: 'mid-vue.cargo.wet.refreshToken',
        data: { refreshToken }
      }).then((res) => {
        const userInfo = this.userInfo
        userInfo.token = res.accessToken
        userInfo.accessToken = res.accessToken
        userInfo.refreshToken = res.refreshToken
        userInfo.refreshTokenEffectiveTime = res.refreshTokenEffectiveTime
        userInfo.tokenEffectiveTime = res.tokenEffectiveTime
        this.setUseInfo(userInfo)
      })
    },

    /**
     * 节流,5s内不会重复执行
     * 更新用户的绑码状态 mid-vue.cargo.miniProgram.syncCustomer
     * 1. 小程序初始化
     * 2. 扫码绑码
     * 3. 个人中心绑码
     * 4. 登录完成后更新绑码状态
     */
    updateCustomerInfo: throttle(
      function () {
        useHttp<ICustomerResp>({ url: 'mid-vue.cargo.miniProgram.syncCustomer' }).then((res) => {
          const userInfo = this.userInfo
          userInfo.customerId = res.customerId
          userInfo.customerCode = res.customerCode
          userInfo.customerName = res.customerShortName
          userInfo.marketName = res.marketName
          userInfo.marketPhone = res.marketPhone
          userInfo.payMode = res.payMode
          this.setUseInfo(userInfo)
          return res
        })
      },
      5000,
      false
    ),

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
        this.mobile = ''
        this.isLogin = false
        this.token = ''
        this.userInfo = {} as IUserInfo
        const envVersion = getEnvVersion()
        clearStorage()
        console.log(getToken())
        //环境不清除，否则会导致切换环境时，无法获取到环境变量
        setEnvVersion(envVersion)
      }
    }
  }
})
