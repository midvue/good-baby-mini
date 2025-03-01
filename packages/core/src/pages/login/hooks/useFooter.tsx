import { withModifiers } from 'vue'
import { useCtxState } from '@mid-vue/use'
import { Checkbox } from '@mid-vue/taro-h5-ui'
import { type ILoginState } from '../types'

export const useFooter = () => {
  const [state, setState] = useCtxState<ILoginState>()

  return {
    render: () => (
      <>
        <div
          class='footer'
          onClick={() => {
            setState((state) => {
              state.checkAgreement = !state.checkAgreement
            })
          }}
        ></div>
      </>
    )
  }
}
