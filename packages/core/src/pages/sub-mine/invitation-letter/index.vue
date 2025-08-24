<script lang="tsx">
import { defineComponent, reactive } from 'vue'
import { WebView } from '@tarojs/components'
import { useShareAppMessage } from '@tarojs/taro'

export default defineComponent({
  name: 'WebPage',
  components: { 'web-view': WebView },
  setup() {
    const state = reactive({
      src: 'https://activity.xfy-66.com/home'
    })

    useShareAppMessage(() => {
      return {
        title: '厉氏宗祠竣工庆典邀请函',
        path: '/pages/sub-mine/invitation-letter/index'
      }
    })

    const handlerMessage = (event: any) => {
      console.log('web-page handlerMessage', event)
    }

    return () => {
      return (
        <div class='invitation-letter'>
          {<web-view src={state.src} onMessage={handlerMessage} class='webview' />}
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
