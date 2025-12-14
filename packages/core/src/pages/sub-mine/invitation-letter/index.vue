<script lang="tsx">
import { defineComponent, reactive } from 'vue'
import { WebView } from '@tarojs/components'
import { useShareAppMessage } from '@tarojs/taro'
import { useRoute } from '@/use'

interface ShareInfo {
  title: string
  fullPath: string
  coverUrl: string
  type: string
}

export default defineComponent({
  name: 'WebPage',
  components: { 'web-view': WebView },
  setup() {
    const route = useRoute()
    const baseUrl = 'https://activity.xfy-66.com'
    const state = reactive<{
      shareInfo: ShareInfo
    }>({
      shareInfo: {
        fullPath: route.query.fullPath || '/home',
        title: '奶娃星球-邀请函'
      } as ShareInfo
    })

    useShareAppMessage(() => {
      return {
        title: state.shareInfo.title,
        path: `/pages/sub-mine/invitation-letter/index?fullPath=${state.shareInfo.fullPath}`,
        imageUrl: state.shareInfo.coverUrl || undefined
      }
    })

    const handlerMessage = (event: { detail: { data: ShareInfo[] } }) => {
      const shareArr = event.detail.data.filter((item) => item.type === 'shareApp')
      const lastIndex = shareArr.length - 1
      state.shareInfo = shareArr[lastIndex]
    }

    return () => {
      return (
        <div class='invitation-letter'>
          {
            <web-view
              src={`${baseUrl}${state.shareInfo.fullPath}`}
              onMessage={handlerMessage}
              class='webview'
            />
          }
        </div>
      )
    }
  }
})
</script>

<style lang="scss">
.invitation-letter {
  width: 100%;
  display: flex;
  height: 100%;

  iframe {
    width: 100%;
    height: 100%;
    border: 0;
    margin: 0;
    padding: 0;
  }

  .webview {
    width: 100%;
  }
}
</style>
