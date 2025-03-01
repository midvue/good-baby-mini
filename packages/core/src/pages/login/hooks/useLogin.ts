import { type BaseEventOrig, type ButtonProps } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useAppStore } from '@/stores'
import { setUserInfo } from '@/utils'
import { useRoute } from '@/use/useTaroRouter'
import { apiLoginByMobile, apiWxLogin } from '../api'
import { type IQuery, type ILoginState } from '../types'

function showToast(title: string) {
  Taro.showToast({ title: title || '登录失败', icon: 'none' })
}

let wxLoginCode = ''
export const useLogin = (state: ILoginState) => {
  Taro.login().then((res) => {
    wxLoginCode = res.code
  })

  const appStore = useAppStore()

  const { query } = useRoute<IQuery>()

  /** 登录成功后跳转回页面 */
  const loginSussBack = () => {
    showToast('登录成功')
    const fromPath = query.fromPath ? `/${query.fromPath}` : ENV_HOME_URL
    Taro.reLaunch({
      url: fromPath
    })
  }
  /** 手机号登录 */
  const phoneLogin = async () => {
    state.showLoading = true
    return await apiLoginByMobile({
      mobile: state.form.mobile.trim(),
      verificationCode: state.form.verificationCode.trim()
    })
      .then(async (res) => {
        if (res.token) {
          appStore.setUseInfo(res)
          return await setUserInfo(res)
        }
        return Promise.reject(res)
      })
      .then(() => {
        return initBaseInfo()
      })
      .then(() => {
        loginSussBack()
      })
      .catch((err) => {
        console.log(err)
        showToast(err.data?.msg || '登录失败')
        return false
      })
      .finally(() => {
        state.showLoading = false
      })
  }

  // 微信一键登录
  const wxLogin = (e: BaseEventOrig<ButtonProps.onGetPhoneNumberEventDetail>) => {
    if (state.showLoading) return
    state.showLoading = true

    Taro.checkSession()
      .then(() => {
        const { iv, encryptedData } = e.detail
        if (!iv || !encryptedData) return Promise.reject()
        return apiWxLogin({
          code: wxLoginCode,
          encryptedData: encryptedData,
          iv: iv
        })
      })
      .then(async (res) => {
        if (res.token) {
          appStore.setUseInfo(res)
          return await setUserInfo(res)
        }
        return Promise.reject(res)
      })
      .then(() => {
        return initBaseInfo()
      })
      .then(() => {
        state.showLoading = false
        loginSussBack()
      })
      .catch((err) => {
        state.showLoading = false
        showToast(err?.message || err?.data?.msg)
        Taro.login().then((res) => {
          wxLoginCode = res.code
        })
      })
  }

  //获取基础资料和用户信息
  const initBaseInfo = async () => {
    return true
  }

  return { wxLogin, phoneLogin }
}
