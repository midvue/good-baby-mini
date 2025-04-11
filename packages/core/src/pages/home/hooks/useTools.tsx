import { BabyInfo } from '@/components/baby-info'
import { EnumFeedType } from '@/dict'
import { navigateTo, reLaunch, useDictMap } from '@/use'
import { FEED_RECORD, getBabyInfo, getStorage, HOME_DRAG_OFFSET, setStorage } from '@/utils'
import { dateFormat, useDate } from '@mid-vue/shared'
import { Drag, Image, showPopup } from '@mid-vue/taro-h5-ui'
import imgFeedDiaper from '../assets/img_feed_diaper.png'
import imgFeedMilk from '../assets/img_feed_milk.png'
import imgHomeAdd from '../assets/img_home_add.png'
import { ref } from 'vue'

export const useTools = () => {
  let poopTypeMap = useDictMap('POOP_TYPE')
  const toolsConfList = [
    {
      feedType: EnumFeedType.MILK_BOTTLE,
      name: '喂养',
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
    const record = getStorage<IFeedRecord>(FEED_RECORD + tool.feedType)
    let feedTime = dateFormat(Date.now(), 'YYYY-MM-DD HH:mm')
    let query = {
      id: undefined,
      feedType: tool.feedType,
      feedTime
    } as Record<string, any>
    if (record) {
      query.content = { ...record.content, feedTime }
    }

    navigateTo({
      path: '/pages/sub-home' + tool.path,
      query
    })
  }

  const formatFeedTime = (record: IFeedRecord | null) => {
    if (!record) return '刚刚'
    let feedDay = useDate(record.feedTime)
    let isToday = feedDay.isSame(useDate(), 'day')
    let yesterday = feedDay.isSame(useDate().subtract(1, 'day'), 'day')
    return feedDay.format(isToday ? 'HH:mm' : yesterday ? '昨天 HH:mm' : 'MM月DD日 HH:mm')
  }

  let renderToolContent = (feedType: EnumFeedType, record: IFeedRecord | null) => {
    if (!record || !feedType) return null
    if (feedType === EnumFeedType.MILK_BOTTLE) {
      return (
        <div class='card-content'>
          <span>{(record.content as IMilkBottle).volume}</span> ml
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
  const offset = ref(getStorage<{ x: number; y: number }>(HOME_DRAG_OFFSET) || { x: -1, y: -1 })
  return {
    render: () => (
      <div class='home-tools'>
        {toolsConfList.map((tool, index) => {
          const record = getStorage<IFeedRecord>(FEED_RECORD + tool.feedType)
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
        <Drag
          gap={{ x: 5, y: 60 }}
          offset={offset.value}
          onOffsetChange={(offset) => {
            setStorage(HOME_DRAG_OFFSET, offset)
          }}
        >
          <Image class='w-[75px] h-[75px]' src={imgHomeAdd} onClick={() => onItemClick(0)}></Image>
        </Drag>
      </div>
    )
  }
}
