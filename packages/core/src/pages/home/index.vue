<script lang="tsx">
import { defineComponent, watch } from 'vue'
import { hideLoading, showLoading } from '@mid-vue/taro-h5-ui'
import { defineCtxState } from '@mid-vue/use'
import { useHeader, useRecords, useTools } from './hooks'
import { type IHomeState } from './types'

export default defineComponent({
  name: 'Home',
  setup() {
    const [state] = defineCtxState<IHomeState>({
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

    const { render: renderHeader } = useHeader()
    const { render: renderTools } = useTools()
    const { render: renderRecords } = useRecords()
    return () => {
      return (
        <div class='home'>
          {renderHeader()}
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
