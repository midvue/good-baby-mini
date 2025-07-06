<script lang="tsx">
import { defineComponent } from 'vue'
import Taro from '@tarojs/taro'
import { Image } from '@mid-vue/taro-h5-ui'
import { EnumFeedType } from '@/dict'
import { navigateTo, useDictList, useDictMap } from '@/use'
import { getFullImageUrl } from '@/utils'

export default defineComponent({
  name: 'ToolsList',
  emits: ['close'],
  setup(_, { emit }) {
    const moreToolsConfList = useDictList('FEED_TYPE')
    const moreToolsConfMap = useDictMap('FEED_TYPE')
    const onItemClick = (
      tool:
        | { bgColor: string; icon: string; path: string; query?: Record<string, string> }
        | undefined
    ) => {
      if (!tool?.path) {
        Taro.showToast({ title: '功能还在开发中,敬请期待!', icon: 'none' })
        return
      }
      navigateTo({
        path: '/pages/sub-home' + tool.path,
        query: tool.query
      })
      emit('close')
    }
    return () => {
      return (
        <div class='home-tools-popup'>
          {moreToolsConfList.map((dict) => {
            const code = dict.code as `${EnumFeedType}`
            const tool = JSON.parse(moreToolsConfMap[code]?.ext || '{}').tool
            return (
              <div
                class='tool-item'
                key={code}
                style={{
                  backgroundColor: tool?.bgColor
                }}
                onClick={() => onItemClick(tool)}
              >
                <Image src={getFullImageUrl(tool?.icon)} class='tool-item-icon'></Image>
                <div class='tool-item-name'>{dict.name}</div>
              </div>
            )
          })}
        </div>
      )
    }
  }
})
</script>
<style lang="scss">
@import './index.scss';
</style>
