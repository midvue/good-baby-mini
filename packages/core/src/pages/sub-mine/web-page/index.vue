<script lang="tsx">
import { defineComponent, reactive, watch } from 'vue'
import { WebView } from '@tarojs/components'
import { uniqueId } from '@mid-vue/shared'
import { useRoute } from '@/use/useTaroRouter'
import { getToken } from '@/utils'
import { useAppStore } from '@/stores'

interface IQuery {
  title?: ''
  url?: ''
}

export default defineComponent({
  name: 'WebPage',
  components: { 'web-view': WebView },
  setup() {
    const appStore = useAppStore()
    const state = reactive({
      src: ''
    })

    const query: IQuery = useRoute().query
    console.log('web-page query', query)
    let url = query.url || ''

    // 自动拼接一个token (互联网要求)
    if (!url.includes('token=')) {
      const splicing = url.includes('?') ? '&' : '?'
      url = `${url}${splicing}token=${getToken()}`
    }
    state.src = decodeURIComponent(url || '')

    const handlerMessage = (event: any) => {
      console.log('web-page handlerMessage', event)
      appStore.updateCustomerInfo()
    }

    watch(
      () => appStore.userInfo.customerCode,
      () => {
        let currentUrl = state.src
        state.src = ''
        setTimeout(() => {
          currentUrl = `${currentUrl}&time=${uniqueId()}`
          state.src = decodeURIComponent(currentUrl || '')
        }, 0)
      }
    )
    return () => {
      return (
        <div class='web-page'>
          {<web-view src={state.src} onMessage={handlerMessage} class='webview' />}
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
