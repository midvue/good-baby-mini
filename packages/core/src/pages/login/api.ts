import { useHttp } from '@mid-vue/http-client'
import { EnumErrorVerificationCodeType } from './dict'
import {
  type ILoginByMobileParams,
  type ILoginParams,
  type ISendVerificationCodeResp
} from './types'

/** 发送验证码 */
export const apiSendVerificationCode = ({
  mobile,
  ticket = ''
}: {
  mobile: string
  ticket: string
}) => {
  return useHttp<ISendVerificationCodeResp>({
    url: 'mid-vue.cargo.wet.sendRegSms',
    data: {
      mobile,
      ticket,
      verificationCodeType: '100' // 登录-100
    },
    ignoreToast: [
      EnumErrorVerificationCodeType.SHOW_SLIDER,
      EnumErrorVerificationCodeType.SHOW_TOAST_SLIDER
    ]
  })
}

/** 验证码登录 */
export const apiLoginByMobile = (data: ILoginByMobileParams) => {
  return useHttp<IUserInfo>({
    url: 'mid-vue.cargo.wet.loginByMobile',
    data: {
      grantType: '100',
      ...data
    },
    token: ''
  })
}

/**
 * 微信注册登录
 */
export const apiWxLogin = (data: ILoginParams) => {
  const option = {
    url: 'mid-vue.cargo.wet.login',
    data,
    token: ''
  }
  return useHttp<IUserInfo>(option)
}
