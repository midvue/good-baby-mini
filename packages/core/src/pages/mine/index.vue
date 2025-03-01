<script lang="tsx">
import { defineComponent } from 'vue'
import { Image, Navbar } from '@mid-vue/taro-h5-ui'
import { useAppStore } from '@/stores/app'

export default defineComponent({
  name: 'Mine',
  setup() {
    const appStore = useAppStore()

    return () => {
      return (
        <div class='mine'>
          <Navbar
            title='我的'
            defaultConfig={{
              frontColor: '#000000',
              backgroundColor: 'transparent'
            }}
          ></Navbar>
        </div>
      )
    }
  }
})
</script>
<style lang="scss">
@import './index.scss';
</style>
