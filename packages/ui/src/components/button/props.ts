import { type PropType } from 'vue'
import { type BaseEventOrig, type ButtonProps } from '@tarojs/components'
import { type TButtonSize, type TButtonType } from './types'

export const buttonProps = {
  type: {
    type: String as PropType<TButtonType>,
    default: 'default'
  },
  size: {
    type: String as PropType<TButtonSize>,
    default: 'medium'
  },
  class: {
    type: String,
    default: ''
  },
  round: {
    type: Boolean,
    default: false
  },
  plain: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  },

  /** 微信开放能力
   *  contact -  打开客服会话
   *  share - 触发用户转发
   *  getPhoneNumber - 手机号快速验证
   *  getUserInfo - 获取用户信息
   *  launchApp - 打开应用
   *  openSetting - 打开授权设置页
   *  chooseAvatar - 选择用户头像
   *  agreePrivacyAuthorization -用户同意隐私协议按钮。
   *  更多看文档
   */
  openType: {
    type: String as PropType<ButtonProps.OpenType>
  },

  /** 获取用户手机号回调
   *
   * 生效时机：`open-type="getPhoneNumber"`
   */
  onGetPhonenumber: {
    type: Function as PropType<(e: BaseEventOrig<ButtonProps.onGetPhoneNumberEventDetail>) => void>
  },
  border: {
    type: Boolean,
    default: false
  },
  loading: {
    type: Boolean,
    default: false
  }
}
