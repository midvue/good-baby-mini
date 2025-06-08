import { BabyInfo } from '@/components/baby-info'
import { EnumFeedType } from '@/dict'
import { useAppStore } from '@/stores'
import { navigateTo, reLaunch, useDictMap } from '@/use'
import { FEED_RECORD, getBabyInfo, getStorage, HOME_DRAG_OFFSET, setStorage } from '@/utils'
import { dateFormat, useDate } from '@mid-vue/shared'
import { Drag, Image, showPopup } from '@mid-vue/taro-h5-ui'
import { useDidShow } from '@tarojs/taro'
import { ref } from 'vue'
import imgFeedDiaper from '../assets/img_feed_diaper.png'
import imgFeedMilk from '../assets/img_feed_milk.png'
import imgHomeAdd from '../assets/img_home_add.png'
import { ToolsList } from '../components/tools-list'

import { apiGetLatestFeedRecords } from '../api'

export const useTools = () => {
  const appStore = useAppStore()
  const poopTypeMap = useDictMap('POOP_TYPE')
  const toolsConfList = [
    {
      feedType: EnumFeedType.MILK_BOTTLE,
      name: '喂养',
      bgImg: imgFeedMilk,
      path: '/feed-milk/index',
      record: ref({} as IFeedRecord)
    },
    {
      feedType: EnumFeedType.DIAPER,
      name: '换尿布',
      bgImg: imgFeedDiaper,
      path: '/diapering/index',
      record: ref({} as IFeedRecord)
    },
    {
      feedType: EnumFeedType.HEIGHT_WEIGHT,
      name: '身高体重',
      path: '/height-weight/index',
      record: ref({} as IFeedRecord)
    }
  ]

  /** 页面显示时获取最新的喂养记录 */

  const getLastList = () => {
    if (!appStore.babyInfo.id) return
    apiGetLatestFeedRecords({
      babyId: appStore.babyInfo.id,
      feedTypes: toolsConfList.map((item) => item.feedType)
    }).then((list) => {
      if (!list) return
      /** 处理返回的记录数据 */
      list.forEach((record, index) => {
        toolsConfList[index].record.value = record || {}
      })
    })
  }
  useDidShow(() => {
    getLastList()
  })

  /** 处理工具卡片点击事件的函数 */
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
    const feedTime = dateFormat(Date.now(), 'YYYY-MM-DD HH:mm')
    const query = {
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

  const formatFeedTime = (record: IFeedRecord | undefined) => {
    if (!record) return '刚刚'
    const feedDay = useDate(record.feedTime)
    const isToday = feedDay.isSame(useDate(), 'day')
    const yesterday = feedDay.isSame(useDate().subtract(1, 'day'), 'day')
    return feedDay.format(isToday ? 'HH:mm' : yesterday ? '昨天 HH:mm' : 'MM月DD日 HH:mm')
  }

  /** 渲染工具卡片的内容 */
  const renderToolContent = (feedType: EnumFeedType, record: IFeedRecord | undefined) => {
    if (!record || !feedType) return null
    let content = record.content || {}
    if (feedType === EnumFeedType.MILK_BOTTLE) {
      return (
        <div class='card-content'>
          <span>{(content as IMilkBottle).volume}</span> ml
        </div>
      )
    }
    if (feedType === EnumFeedType.DIAPER) {
      return (
        <div class='card-content'>
          <span>{poopTypeMap[(content as IDiaper).poopType]?.name}</span>
        </div>
      )
    }
    if (feedType === EnumFeedType.HEIGHT_WEIGHT) {
      content = content as IHeightWeight
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
  const onPopShowClick = () => {
    showPopup({
      round: true,
      height: '40%',
      render() {
        return <ToolsList></ToolsList>
      }
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
              <div class='card-time'>{formatFeedTime(tool.record.value)}</div>
              <div class='card-title'>{tool.name}</div>
              {renderToolContent(tool.feedType, tool.record.value)}

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
          <Image
            class='w-[75px] h-[75px]'
            src={imgHomeAdd}
            onClick={() => onPopShowClick()}
          ></Image>
        </Drag>
      </div>
    )
  }
}
