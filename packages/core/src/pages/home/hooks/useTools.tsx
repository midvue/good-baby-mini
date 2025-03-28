import { BabyInfo } from '@/components/baby-info'
import { EnumFeedType } from '@/dict'
import { navigateTo, reLaunch, useDictMap } from '@/use'
import { getBabyInfo } from '@/utils'
import { dateFormat } from '@mid-vue/shared'
import { Image, showPopup } from '@mid-vue/taro-h5-ui'
import { useCtxState } from '@mid-vue/use'
import imgFeedDiaper from '../assets/img_feed_diaper.png'
import imgFeedMilk from '../assets/img_feed_milk.png'
import { type IHomeState } from '../types'

export const useTools = () => {
  const [state] = useCtxState<IHomeState>()

  let poopTypeMap = useDictMap('POOP_TYPE')
  const toolsConfList = [
    {
      feedType: EnumFeedType.MILK,
      name: '奶粉',
      bgImg: imgFeedMilk,
      path: '/feed-milk/index'
    },
    {
      feedType: EnumFeedType.DIAPER,
      name: '换尿布',
      bgImg: imgFeedDiaper,
      path: '/diapering/index'
    },
    {
      feedType: EnumFeedType.HEIGHT_WEIGHT,
      name: '身高体重',
      path: '/height-weight/index'
    }
  ]

  function onItemClick(index: number) {
    if (!getBabyInfo().id) {
      // 未绑定宝宝
      showPopup({
        round: true,
        height: '60%',
        title: '添加宝宝',
        render(scoped) {
          return (
            <BabyInfo
              onClose={() => {
                scoped.close()
                reLaunch({
                  path: '/pages/home/index'
                })
              }}
            ></BabyInfo>
          )
        }
      })
      return
    }
    const tool = toolsConfList[index]
    const record = state.feedRecords.find((item) => +item.feedType === tool.feedType)
    let feedTime = dateFormat(Date.now(), 'YYYY-MM-DD HH:mm')
    navigateTo({
      path: '/pages/sub-home' + tool.path,
      query: {
        id: undefined,
        feedType: tool.feedType,
        feedTime,
        content: { ...record?.content, feedTime }
      }
    })
  }

  const formatFeedTime = (record?: IFeedRecord) => {
    if (!record) return '刚刚'
    return record.feedTimeStr?.replace(/.*\((.*)\)/, '$1')
  }

  let renderToolContent = (feedType: EnumFeedType, record?: IFeedRecord) => {
    if (!record || !feedType) return null
    if (feedType === EnumFeedType.MILK) {
      return (
        <div class='card-content'>
          <span>{(record.content as IMilk).volume}</span> ml
        </div>
      )
    }
    if (feedType === EnumFeedType.DIAPER) {
      return (
        <div class='card-content'>
          <span>{poopTypeMap[(record.content as IDiaper).poopType]?.name}</span>
        </div>
      )
    }
    if (feedType === EnumFeedType.HEIGHT_WEIGHT) {
      let content = record.content as IHeightWeight
      return (
        <div class='card-content'>
          <span>{content.height}cm </span>
          <span>{content.weight}kg</span>
        </div>
      )
    }
    return null
  }

  return {
    render: () => (
      <div class='home-tools'>
        {toolsConfList.map((tool, index) => {
          const record = state.feedRecords.find((item) => +item.feedType === tool.feedType)
          return (
            <div
              class={['home-tools-card', 'tools-card-' + tool.feedType]}
              key={index}
              onClick={() => onItemClick(index)}
            >
              <div class='card-time'>{formatFeedTime(record)}</div>
              <div class='card-title'>{tool.name}</div>
              {renderToolContent(tool.feedType, record)}

              {tool.bgImg && <Image src={tool.bgImg} class='card-bg-image'></Image>}
            </div>
          )
        })}
      </div>
    )
  }
}
