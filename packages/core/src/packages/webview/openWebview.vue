<script lang="tsx">
import { defineComponent, reactive } from 'vue'
import { WebView } from '@tarojs/components'
import { useRoute } from '@/use/useTaroRouter'
import { getToken } from '@/utils'

interface IQuery {
  title?: ''
  url?: ''
}

/** 兼容旧版互联网内部跳转 */
export default defineComponent({
  name: 'WebPageOpenWebview',
  components: { 'web-view': WebView },
  setup() {
    const state = reactive({
      src: ''
    })

    const query: IQuery = useRoute().query
    // 自动拼接一个token (互联网要求)
    let url = query.url || ''
    if (!url.includes('token=')) {
      const splicing = url.includes('?') ? '&' : '?'
      url = `${url}${splicing}token=${getToken()}`
    }
    state.src = decodeURIComponent(url || '')

    const handlerMessage = (event: any) => {
      console.log('handlerMessage webview', event)
    }

    return () => {
      return (
        <div class='web-page'>
          {state.src && <web-view src={state.src} class='webview' onMessage={handlerMessage} />}
        </div>
      )
    }
  }
})
</script>

<style lang="scss">
.web-page {
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
