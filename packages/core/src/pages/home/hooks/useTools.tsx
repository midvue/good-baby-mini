import { ref } from 'vue'
import Taro, { useDidShow } from '@tarojs/taro'
import { dateFormat, useDate } from '@mid-vue/shared'
import { Drag, Image, showPopup } from '@mid-vue/taro-h5-ui'
import { BabyInfo } from '@/components/baby-info'
import { EnumFeedType } from '@/dict'
import { navigateTo, reLaunch, useDictMap } from '@/use'
import { FEED_RECORD, getBabyInfo, getStorage, HOME_DRAG_OFFSET, setStorage } from '@/utils'
import { useAppStore } from '@/stores'
import imgFeedDiaper from '../assets/img_feed_diaper.png'
import imgFeedMilk from '../assets/img_feed_milk.png'
import imgHomeAdd from '../assets/img_home_add.png'
import imgToolDiaper from '../assets/icon_tool_diaper.png'
import imgToolMilk from '../assets/icon_tool_milk.png'
import imgToolSleep from '../assets/icon_tool_sleep.png'
import imgToolWeight from '../assets/icon_tool_weight.png'
import imgToolVaccine from '../assets/icon_tool_vaccine.png'
import imgToolFood from '../assets/icon_tool_food.png'
import imgToolSupplement from '../assets/icon_tool_supplement.png'

import { type IFeedRecord } from '../types'
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
      record: ref<IFeedRecord>()
    },
    {
      feedType: EnumFeedType.DIAPER,
      name: '换尿布',
      bgImg: imgFeedDiaper,
      path: '/diapering/index',
      record: ref<IFeedRecord>()
    },
    {
      feedType: EnumFeedType.HEIGHT_WEIGHT,
      name: '身高体重',
      path: '/height-weight/index',
      record: ref<IFeedRecord>()
    }
  ]

  const moreToolsConfList = [
    {
      feedType: EnumFeedType.MILK_BOTTLE,
      name: '喂奶',
      icon: imgToolMilk,
      bgColor: '#FFF7F8',
      path: '/feed-milk/index'
    },
    {
      feedType: EnumFeedType.DIAPER,
      name: '尿片',
      icon: imgToolDiaper,
      bgColor: '#FAF6FF',
      path: '/diapering/index'
    },
    {
      feedType: EnumFeedType.HEIGHT_WEIGHT,
      name: '体重',
      icon: imgToolWeight,
      bgColor: '#FFFAF0',
      path: '/height-weight/index'
    },
    {
      feedType: EnumFeedType.VACCINE,
      name: '疫苗',
      icon: imgToolVaccine,
      bgColor: '#FFF6F7',
      path: ''
    },
    {
      feedType: EnumFeedType.SUPPLEMENT,
      name: '补剂',
      icon: imgToolSupplement,
      bgColor: '#F9F6FF',
      path: ''
    },
    {
      feedType: EnumFeedType.SLEEP,
      name: '睡眠',
      icon: imgToolSleep,
      bgColor: '#F4F7FF',
      path: ''
    },
    {
      feedType: EnumFeedType.BABY_FOOD,
      name: '辅食',
      icon: imgToolFood,
      bgColor: '#FEF9F3',
      path: ''
    }
  ]
  /** 页面显示时获取最新的喂养记录 */
  const getLastList = () => {
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
      const content = record.content as IHeightWeight
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
        return (
          <div class='home-tools-popup'>
            {moreToolsConfList.map((tool) => (
              <div
                class={`tool-item ${tool.bgColor}`}
                key={tool.feedType}
                style={{
                  backgroundColor: tool.bgColor
                }}
                onClick={() => {
                  if (tool.path === '') {
                    Taro.showToast({ title: '功能还在开发中,敬请期待!', icon: 'none' })
                    return
                  }
                  navigateTo({
                    path: '/pages/sub-home' + tool.path
                  })
                }}
              >
                <Image src={tool.icon} class='tool-item-icon'></Image>
                <div class='tool-item-name'>{tool.name}</div>
              </div>
            ))}
          </div>
        )
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
