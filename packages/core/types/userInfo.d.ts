import { type EnumPayMode } from '@/dict'

declare global {
  interface IUserInfo {
    /** 令牌 */
    token: string
    accessToken: string
    /** 刷新token */
    refreshToken: string
    /** 令牌有效时间 */
    tokenEffectiveTime: number
    /** 令牌刷新时间 */
    refreshTokenEffectiveTime: number
    /** 手机号 */
    mobile: string
    /** 客户ID */
    customerId: string
    /** 客户编码 */
    customerCode: string
    /** 客户编码 */
    customerCode: string
    /** 客户名称 (简称) */
    customerName: string
    /** 销售经理 */
    marketName: string
    /** 销售助理 */
    assistantName: string
    /** 销售经理电话 */
    marketPhone: string
    /** 销售助理电话 */
    assistantPhone: string
    /** 用户id */
    userId: string
    payMode: EnumPayMode
  }
}
export {}
