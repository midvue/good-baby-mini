<script lang="tsx">
import { getBabyInfo } from '@/utils'
import { hideLoading, SafeBottom, showLoading } from '@mid-vue/taro-h5-ui'
import { defineCtxState } from '@mid-vue/use'
import { defineComponent, watch } from 'vue'
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
      babyInfo: getBabyInfo() || ({} as BabyInfo),
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
          <SafeBottom></SafeBottom>
        </div>
      )
    }
  }
})
</script>
<style lang="scss">
@import './index.scss';
</style>
