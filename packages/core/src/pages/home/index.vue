<script lang="tsx">
import { defineComponent, watch } from 'vue'

import { useShareAppMessage } from '@tarojs/taro'
import { hideLoading, SafeBottom, showLoading } from '@allkit/taro-h5-ui'
import { defineCtxState } from '@allkit/use'
import { useHeader, useRecords, useTools } from './hooks'
import { type IHomeState } from './types'

export default defineComponent({
  name: 'Home',
  setup() {
    const [state] = defineCtxState<IHomeState>({
      loading: false,
      pagination: {
        current: 1,
        size: 2,
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
    useShareAppMessage(() => {
      return {
        title: '奶娃星球邀请您加入喂养',
        path: '/pages/home/index',
        imageUrl: `${ENV_CDN_BASE}image/home/share.jpg`
      }
    })
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
