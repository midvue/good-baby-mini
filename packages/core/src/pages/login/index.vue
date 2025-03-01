<script lang="tsx">
import { defineComponent, watch } from 'vue'
import { hideLoading, Image, Navbar, showLoading } from '@mid-vue/taro-h5-ui'
import { defineCtxState } from '@mid-vue/use'
import { useAppStore } from '@/stores'
import { useContent, useFooter } from './hooks'
import { type ILoginState } from './types'

export default defineComponent({
  name: 'Login',
  setup() {
    const appStore = useAppStore()

    const [state, setState] = defineCtxState<ILoginState>({
      showLoading: false,
      showPhonePopup: false,
      checkAgreement: false,
      loginByPhone: false,
      showReadAgreementDialog: false,
      ticket: '',
      form: {
        mobile: '',
        verificationCode: ''
      },
      activeIndex: 0
    })

    appStore.logout()

    watch(
      () => state.showLoading,
      (val) => {
        val ? showLoading() : hideLoading()
      }
    )

    const { render: renderContent } = useContent()
    const { render: renderFooter } = useFooter()

    return () => (
      <div class='login'>
        <Navbar position='fixed' leftArrow={false} showHome={false}></Navbar>
        <div class='login-content-box'>
          <div class='content-box-bg-btns'>{renderContent()}</div>
          <div class='fill1'></div>
          {renderFooter()}
        </div>
      </div>
    )
  }
})
</script>

<style lang="scss">
@import './index.scss';
</style>
