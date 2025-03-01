<script lang="tsx">
import { defineComponent } from 'vue'
import { Image, Navbar } from '@mid-vue/taro-h5-ui'
import { useAppStore } from '@/stores/app'
import { themeConfig } from '@/dict'

export default defineComponent({
  name: 'Home',
  setup() {
    const appStore = useAppStore()

    return () => {
      return (
        <div class='home'>
          <Navbar
            defaultConfig={{
              frontColor: '#000000',
              backgroundColor: 'transparent'
            }}
          >
            {{
              left: () =>
                appStore.isLogin && (
                  <Image src='mine/icon-scan-btn.png' class='scan-btn' onClick={() => {}} />
                )
            }}
          </Navbar>
        </div>
      )
    }
  }
})
</script>
<style lang="scss">
@import './index.scss';
</style>
