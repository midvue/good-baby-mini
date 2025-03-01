import Taro from '@tarojs/taro'
import { useCtxState } from '@mid-vue/use'
import { Button } from '@mid-vue/taro-h5-ui'
import { type ILoginState } from '../types'
import { useLogin } from './useLogin'

export const useContent = () => {
  const [state, setState] = useCtxState<ILoginState>()

  /** 手机号登录 */
  const handleToPhoneLogin = () => {
    setState((state) => {
      state.loginByPhone = true
    })
    if (!state.checkAgreement) {
      setState((state) => {
        state.showReadAgreementDialog = true
      })
      return
    }
    setState((state) => {
      state.showPhonePopup = true
    })
  }

  /** 一键登录：未同意协议 */
  const handleToConfirm = () => {
    setState((state) => {
      state.loginByPhone = false
    })
    setState((state) => {
      state.showReadAgreementDialog = true
    })
  }

  const { wxLogin } = useLogin(state)

  return {
    render: () => (
      <div class='content'>
        <div class='form'>
          {state.checkAgreement ? (
            <Button
              openType='getPhoneNumber'
              type='primary'
              size='large'
              onGetPhonenumber={wxLogin}
            >
              一键登录
            </Button>
          ) : (
            <Button type='primary' size='large' onClick={handleToConfirm}>
              一键登录
            </Button>
          )}

          <Button size='large' onClick={handleToPhoneLogin} plain>
            手机号登录
          </Button>
        </div>
      </div>
    )
  }
}
