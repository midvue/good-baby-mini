import { EnumFeedType } from '@/dict'
import { useAppStore } from '@/stores'
import { navigateTo, useDictMap } from '@/use'
import { dateDiff, dateFormat, durationFormatNoZero, useDate } from '@mid-vue/shared'
import { Image, showDialog } from '@mid-vue/taro-h5-ui'
import { useCtxState } from '@mid-vue/use'
import { ScrollView } from '@tarojs/components'
import { useDidShow } from '@tarojs/taro'
import { reactive, watch } from 'vue'
import { apiDeleteFeedRecord, apiGetFeedRecordList } from '../api'
import IconFeedDiaper from '../assets/icon_feed_diaper.png'
import iconFeedHeight from '../assets/icon_feed_height.png'
import iconFeedMilk from '../assets/icon_feed_milk.png'
import { type IHomeState } from '../types'

/**  喂养记录 */
export const useRecords = () => {
  const [state, setState] = useCtxState<IHomeState>()

  let appStore = useAppStore()
  let currState = reactive({
    isRefresher: false
  })

  watch(
    () => state.babyInfo.id,
    (id) => {
      id && getRecordList()
    }
  )

  /** 获取喂养记录 */
  async function getRecordList(isRefresh = true) {
    if (!appStore.isLogin || !state.babyInfo.id) return
    if (isRefresh) {
      setState((state) => {
        state.pagination.current = 1
      })
    } else {
      currState.isRefresher = false
      setState((state) => {
        state.loading = true
        state.pagination.current += 1
      })
    }
    const res = await apiGetFeedRecordList({
      babyId: state.babyInfo.id,
      ...state.pagination
    })
    let list = res.list || []
    let now = Date.now()
    //格式化时间
    list = list.map((record) => {
      let duration = dateDiff(now, record.feedTime)
      let feedDay = useDate(record.feedTime)
      let isToday = feedDay.isSame(useDate(), 'day')
      let yesterday = feedDay.isSame(useDate().subtract(1, 'day'), 'day')
      let feedTimeStr = `${
        duration < 60000
          ? '刚刚'
          : durationFormatNoZero(duration, {
              format: isToday ? 'H小时m分前' : 'D天H小时m分前'
            })
      } (${feedDay.format(isToday ? 'HH:mm' : yesterday ? '昨天 HH:mm' : 'MM月DD日 HH:mm')})`
      return { ...record, feedTimeStr }
    })

    setState((state) => {
      if (isRefresh) {
        state.feedRecords = list
      } else {
        state.feedRecords = state.feedRecords.concat(list)
      }
    })
  }

  useDidShow(() => {
    getRecordList()
  })

  let milkTypeMap = useDictMap('MILK_TYPE')
  let diaperTypeMap = useDictMap('DIAPER_TYPE')
  let poopTypeMap = useDictMap('POOP_TYPE')

  let onRefresh = async () => {
    currState.isRefresher = true
    await getRecordList()
    currState.isRefresher = false
  }
  let onLoadMore = () => {
    getRecordList(false).finally(() => setState((state) => (state.loading = false)))
  }

  let feedTypeStrategy = {
    /** 奶粉 */
    [EnumFeedType.MILK]: {
      path: '/pages/sub-home/feed-milk/index',
      render: (content: IMilk) => {
        let { volume, type } = content
        return (
          <div class='home-records-item-wrapper'>
            <div class='record-item-logo'>
              <Image src={iconFeedMilk} class='item-logo-img'></Image>
            </div>
            <div>
              <div class='records-item-title'>{milkTypeMap[type]?.name}</div>
              <div class='records-item-content'>
                总量:<span class='content-volume'> {volume}</span> ml
              </div>
            </div>
          </div>
        )
      }
    },
    /** 尿布 */
    [EnumFeedType.DIAPER]: {
      path: '/pages/sub-home/diapering/index',
      render: (content: IDiaper) => {
        let { type } = content
        return (
          <div class='home-records-item-wrapper'>
            <div class='record-item-logo'>
              <Image src={IconFeedDiaper} class='item-logo-img'></Image>
            </div>
            <div>
              <div class='records-item-title'>{diaperTypeMap[type]?.name}</div>
              <div class='records-item-content'>{poopTypeMap[type]?.name}</div>
            </div>
          </div>
        )
      }
    },
    [EnumFeedType.HEIGHT_WEIGHT]: {
      path: '/pages/sub-home/height-weight/index',
      render: (content: IHeightWeight) => {
        let { weight, height } = content
        return (
          <div class='home-records-item-wrapper'>
            <div class='record-item-logo'>
              <Image src={iconFeedHeight} class='item-logo-img'></Image>
            </div>
            <div>
              <div class='records-item-title'>身高: {height} cm</div>
              <div class='records-item-content'>体重: {weight} kg</div>
            </div>
          </div>
        )
      }
    }
  } as const

  let onRecordsItemClick = (record: IFeedRecord) => {
    let strategy = feedTypeStrategy[record.feedType]
    navigateTo({
      path: strategy.path,
      query: record
    })
  }
  let onDeleteRecord = (record: IFeedRecord) => {
    showDialog({
      title: '删除记录',
      render: () => '确认删除 \n' + record.feedTimeStr + ' 的记录吗？',
      onConfirm: async () => {
        await apiDeleteFeedRecord(record.id)
        getRecordList()
      }
    })
  }

  return {
    render: () => {
      return (
        <div class='home-records'>
          <div class='home-records-header'>
            <div class='header-title'>喂养记录</div>
            <div class='header-more'>更多</div>
          </div>

          <ScrollView
            class='home-records-wrapper'
            scroll-y
            refresher-enabled
            refresher-triggered={currState.isRefresher}
            onRefresherrefresh={onRefresh}
            onScrolltolower={onLoadMore}
          >
            <div class='home-records-scroll'>
              {state.feedRecords.map((record, index) => {
                let strategy = feedTypeStrategy[record.feedType]
                return (
                  <div
                    class={['home-records-item', 'records-item-' + record.feedType]}
                    key={index}
                    //@ts-ignore
                    onLongpress={() => onDeleteRecord(record)}
                    onClick={() => onRecordsItemClick(record)}
                  >
                    <div class='records-item-time'>{record.feedTimeStr}</div>
                    {strategy.render(record.content)}
                  </div>
                )
              })}
            </div>
          </ScrollView>
        </div>
      )
    }
  }
}
