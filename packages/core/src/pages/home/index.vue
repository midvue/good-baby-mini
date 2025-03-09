<script lang="tsx">
import { hideLoading, Navbar, showLoading } from '@mid-vue/taro-h5-ui'
import { defineCtxState } from '@mid-vue/use'
import { defineComponent, watch } from 'vue'
import { useRecords, useTools } from './hooks'
import { type IHomeState } from './types'

export default defineComponent({
  name: 'Home',
  setup() {
    const [state, setState] = defineCtxState<IHomeState>({
      loading: false,
      pagination: {
        current: 1,
        size: 16,
        total: 0
      },
      feedRecords: []
    })

    watch(
      () => state.loading,
      (loading) => {
        loading
          ? showLoading({
              title: '加载中'
            })
          : hideLoading()
      }
    )

    const { render: renderTools } = useTools()
    const { render: renderRecords } = useRecords()
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
          {renderTools()}
          {renderRecords()}
        </div>
      )
    }
  }
})
</script>
<style lang="scss">
@import './index.scss';
</style>
