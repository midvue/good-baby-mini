import { navigateTo } from '@/use'
import { dateFromNow } from '@mid-vue/shared'
import { useCtxState } from '@mid-vue/use'
import { reactive } from 'vue'
import { type IHomeState } from '../types'
import { EnumFeedType } from '../dict'
import imgFeedMilk from '../assets/img_feed_milk.png'
import imgFeedDiaper from '../assets/img_feed_diaper.png'
import { Image } from '@mid-vue/taro-h5-ui'

export const useTools = () => {
  const [state, setState] = useCtxState<IHomeState>()

  const currState = reactive({
    tools: []
  })

  const toolsConfList = [
    {
      feedType: EnumFeedType.MILK,
      name: '奶粉',
      bgImg: imgFeedMilk
    },
    { feedType: EnumFeedType.DIAPER, name: '换尿布', bgImg: imgFeedDiaper },
    { feedType: EnumFeedType.HEIGHT_WEIGHT, name: '身高体重' }
  ]

  function onItemClick(index: number) {
    const tool = toolsConfList[index]
    navigateTo({
      path: '/pages/sub-home' + tool.path,
      query: {
        feedType: tool.feedType
      }
    })
  }

  const formatFeedTime = (feedType: number) => {
    const record = state.feedRecords.find((item) => +item.feedType === feedType)
    if (!record) return '刚刚'
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
              {tool.bgImg && <Image src={tool.bgImg} class='card-bg-image'></Image>}
            </div>
          )
        })}
      </div>
    )
  }
}
