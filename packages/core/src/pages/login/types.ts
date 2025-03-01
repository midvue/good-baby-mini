export interface IQuery {
  /** 从什么地方跳转登陆 */
  fromPath: string
}
export interface ISendVerificationCodeResp {
  duration: number
}

/** 微信登陆 */
export interface ILoginParams {
  /** 状态码 */
  code: string
  /** 微信iv偏移量 */
  iv: string
  /** 微信加密数据 */
  encryptedData: string
}

/** 验证码登录 */
export interface ILoginByMobileParams {
  /** 电话 */
  mobile: string
  /** 验证码 */
  verificationCode: string
  /** 授权类型 */
  grantType?: string
  /** 经度 */
  longitude?: string
  /**  纬度 */
  latitude?: string
}

/** 签署协议 */
export interface IAgreementSaveParams {
  agreementId: string
  agreementName: string
  versionNum: string
}

export interface ILoginState {
  showLoading: boolean
  loginByPhone: boolean
  /** 手机号登录表单 */
  showPhonePopup: boolean
  /** 手机号登录表单 */
  form: {
    mobile: string
    verificationCode: string
  }
}
