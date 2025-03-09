<script lang="tsx">
import { defineComponent } from 'vue'
import { Navbar } from '@mid-vue/taro-h5-ui'
import { useAppStore } from '@/stores/app'
import { useList, useProfile } from './hooks'

export default defineComponent({
  name: 'Mine',
  setup() {
    const appStore = useAppStore()

    let { render: renderProfile } = useProfile()
    let { render: renderList } = useList()

    return () => {
      return (
        <div class='mine'>
          {renderProfile()}
          {renderList()}
        </div>
      )
    }
  }
})
</script>
<style lang="scss">
@import './index.scss';
</style>
