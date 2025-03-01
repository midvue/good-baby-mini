<script lang="tsx">
import { defineComponent } from 'vue'
import { Navbar } from '@mid-vue/taro-h5-ui'
import { useAppStore } from '@/stores/app'

export default defineComponent({
  name: 'Home',
  setup() {
    const appStore = useAppStore()

    return () => {
      return (
        <div class='home'>
          <Navbar
            title='首页'
            defaultConfig={{
              frontColor: '#000000',
              backgroundColor: 'transparent'
            }}
          ></Navbar>
          <div class='home-header'>
            <div class='mr-20'>111</div>
          </div>
        </div>
      )
    }
  }
})
</script>
<style lang="scss">
@import './index.scss';
</style>
