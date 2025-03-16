<script lang="tsx">
import { useRoute } from '@/use/useTaroRouter'
import { WebView } from '@tarojs/components'
import { defineComponent, reactive } from 'vue'

interface IQuery {
  title?: ''
  url?: ''
}

export default defineComponent({
  name: 'WebPage',
  components: { 'web-view': WebView },
  setup() {
    const state = reactive({
      src: ''
    })

    const query: IQuery = useRoute().query
    let url = query.url || ''

    state.src = decodeURIComponent(url || '')

    const handlerMessage = (event: any) => {
      console.log('web-page handlerMessage', event)
    }

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
