<script lang="tsx">
import { defineComponent, watch } from 'vue'
import { hideLoading, SafeBottom, showLoading } from '@mid-vue/taro-h5-ui'
import { defineCtxState } from '@mid-vue/use'
import { useHeader, useRecords, useTools } from './hooks'
import { type IHomeState } from './types'
import { getFullImageUrl } from '@/utils'

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
          <SafeBottom></SafeBottom>
        </div>
      )
    }
  },
  onShareAppMessage() {
    return {
      title: '奶娃星球邀请您加入喂养', // 分享标题
      path: '/pages/home/index', // 分享路径
      imageUrl: getFullImageUrl('share.jpg')
    }
  }
})
</script>
<style lang="scss">
@import './index.scss';
</style>
