import { navigateTo } from '@/use'
import { dateFromNow } from '@mid-vue/shared'
import { useCtxState } from '@mid-vue/use'
import { reactive } from 'vue'
import { type IHomeState } from '../types'
import { EnumFeedType } from '../dict'

export const useTools = () => {
  const [state, setState] = useCtxState<IHomeState>()

  const currState = reactive({
    tools: []
  })

  const toolsConfList = [
    {
      feedType: EnumFeedType.MILK,
      name: '奶粉'
    },
    { feedType: EnumFeedType.DIAPER, name: '换尿布' },
    { feedType: EnumFeedType.HEIGHT_WEIGHT, name: '身高体重' }
  ]

  function onItemClick(index: number) {
    const tool = toolsConfList[index]
    navigateTo({
      path: '/pages/sub-home/feed-milk/index',
      query: {
        feedType: tool.feedType
      }
    })
  }

  const formatFeedTime = (feedType: number) => {
    const record = state.feedRecords.find((item) => +item.feedType === feedType)
    if (!record) return ''
    return dateFromNow(record.feedTime, {
      today: '${h}小时${m}分钟前'
    })
  }

  return {
    render: () => (
      <div class='home-tools'>
        {toolsConfList.map((tool, index) => {
          return (
            <div
              class={['home-tools-card', 'tools-card-' + tool.feedType]}
              key={index}
              onClick={() => onItemClick(index)}
            >
              <div class='card-time'>{formatFeedTime(tool.feedType)}</div>
              <div class='card-title'>{tool.name}</div>
              <div class='card-content'>150ml</div>
            </div>
          )
        })}
      </div>
    )
  }
}
