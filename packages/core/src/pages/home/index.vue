<script lang="tsx">
import { defineComponent, watch } from 'vue'
import { hideLoading, SafeBottom, showLoading } from '@mid-vue/taro-h5-ui'
import { defineCtxState } from '@mid-vue/use'
import { useHeader, useRecords, useTools } from './hooks'
import { type IHomeState } from './types'
import { stringify } from 'postcss'

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
    console.log(
      JSON.stringify({
        summary: {
          sort: 3,
          children: [
            {
              label: '次数',
              code: '10'
            },
            {
              label: '喂养量',
              code: '20'
            },
            {
              label: '时段',
              code: '30'
            }
          ]
        },
        tool: {
          icon: 'https://app-1359622524.cos.ap-guangzhou.myqcloud.com/good-baby-mini/image/home/icon_tool_breast.png',
          bgColor: '#FFF7F8',
          path: '/feed-milk/index',
          query: {
            feedType: '20'
          }
        }
      })
    )

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
      imageUrl:
        'https://app-1359622524.cos.ap-guangzhou.myqcloud.com/good-baby-mini/image/share.jpg' // 分享图片路径
    }
  }
})
</script>
<style lang="scss">
@import './index.scss';
</style>
