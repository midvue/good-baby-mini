import Taro from '@tarojs/taro'
import Http from '@mid-vue/http-client'
import { useAppStore } from '@/stores'
import { setUserInfo } from '@/utils'

function showToast(title: string) {
  Taro.showToast({ title: title || '登录失败', icon: 'none' })
}

export const useLogin = () => {
  const appStore = useAppStore()

  // 微信一键登录
  const wxLogin = async () => {
    Taro.login()
      .then((res) => {
        const option = {
          url: '/app/account/wxLogin',
          data: { code: res.code }
        }
        return Http.post<IUserInfo>(option)
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
      .catch((err) => {
        showToast(err?.message || err?.data?.msg)
        // Taro.login().then((res) => {
        //   wxLoginCode = res.code
        // })
      })
  }

  //获取基础资料和用户信息
  const initBaseInfo = async () => {
    return true
  }

  return { wxLogin }
}
