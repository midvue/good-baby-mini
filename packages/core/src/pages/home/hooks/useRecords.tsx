import { EnumFeedType } from '@/dict'
import { useAppStore } from '@/stores'
import { navigateTo, useDictList, useDictMap } from '@/use'
import { dateDiff, durationFormatNoZero, minute, useDate } from '@mid-vue/shared'
import { Image, showDialog } from '@mid-vue/taro-h5-ui'
import { useCtxState } from '@mid-vue/use'
import { ScrollView } from '@tarojs/components'
import { useDidShow } from '@tarojs/taro'
import { reactive, watch } from 'vue'
import { apiDeleteFeedRecord, apiGetFeedRecordList } from '../api'
import IconFeedDiaper from '../assets/icon_feed_diaper.png'
import iconFeedHeight from '../assets/icon_feed_height.png'
import iconFeedMilk from '../assets/icon_feed_milk.png'
import { SummaryFeedRecord, type IHomeState } from '../types'

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
  let startFeedTime = useDate().subtract(4, 'day').format('YYYY-MM-DD 00:00:00')
  let endFeedTime = useDate().format('YYYY-MM-DD 23:59:59')
  let dayMap = {} as Record<string, SummaryFeedRecord>
  /** 获取喂养记录 */
  async function getRecordList(isRefresh = true) {
    if (!appStore.isLogin || !state.babyInfo.id) return
    if (isRefresh) {
      setState((state) => {
        state.pagination.current = 1
        dayMap = {}
      })
    } else {
      currState.isRefresher = false
      setState((state) => {
        state.loading = true
        state.pagination.current += 1
      })
    }
    const res = await apiGetFeedRecordList({
      startFeedTime,
      endFeedTime,
      babyId: state.babyInfo.id,
      ...state.pagination
    })
    let list = res.list || []
    let now = Date.now()

    //格式化时间
    let feedRecords = list.reduce(
      (records, record) => {
        /** 喂养类型 */
        let duration = dateDiff(now, record.feedTime)
        let feedDay = useDate(record.feedTime)
        let isToday = feedDay.isSame(useDate(), 'day')
        let yesterday = feedDay.isSame(useDate().subtract(1, 'day'), 'day')
        let key = isToday ? '今天' : yesterday ? '昨天' : feedDay.format('MM月DD日')
        /** 处理汇总 */
        let { isAdd, summary } = formatSummary(key, record)
        if (isAdd) {
          records.push(summary)
        }
        //普通Record明细
        let feedTimeStr = `${
          duration < 60000
            ? '刚刚'
            : durationFormatNoZero(duration, {
                format: isToday ? 'H小时m分前' : 'D天H小时m分前'
              })
        } (${feedDay.format(isToday ? 'HH:mm' : yesterday ? '昨天 HH:mm' : 'MM月DD日 HH:mm')})`

        records.push({ ...record, feedTimeStr })

        return records
      },
      [] as (IFeedRecord | SummaryFeedRecord)[]
    )

    setState((state) => {
      if (isRefresh) {
        state.feedRecords = feedRecords
      } else {
        state.feedRecords = state.feedRecords.concat(feedRecords)
      }
    })
  }

  /** 格式化每日汇总 */
  function formatSummary(key: string, record: IFeedRecord) {
    let feedType = record.feedType
    let isAdd = false
    /** 每日汇总 */
    let summary = dayMap[key] as SummaryFeedRecord
    if (!summary) {
      summary = {
        feedTime: record.feedTime,
        feedTimeStr: key
      } as SummaryFeedRecord
      dayMap[key] = summary
      isAdd = true
    }
    // 按照喂养类型分类
    let feedTypeItem = summary[feedType]
    if (!feedTypeItem) {
      feedTypeItem = {
        content: {
          label: '',
          volume: 0
        },
        count: 0,
        label: feedType
      }
      summary[feedType] = feedTypeItem
    }
    feedTypeItem.count += 1
    /** 奶粉喂养,计算容量 */
    if (feedType === EnumFeedType.MILK) {
      let { volume, type } = record.content as IMilk
      feedTypeItem.content.label = milkTypeMap[type]?.name || ''
      feedTypeItem.content.volume += volume
    }
    return { isAdd, summary }
  }

  let feedTypeMap = useDictMap('FEED_TYPE')
  const feedTypeList = useDictList('FEED_TYPE')
  let milkTypeMap = useDictMap('MILK_TYPE')
  let diaperTypeMap = useDictMap('DIAPER_TYPE')
  let poopTypeMap = useDictMap('POOP_TYPE')
  const poopColorMap = useDictMap('POOP_COLOR')

  useDidShow(() => {
    getRecordList()
  })
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
      render: (content: IFeedRecord['content']) => {
        let { volume, type } = content as IMilk
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
      render: (content: IFeedRecord['content']) => {
        let { type, poopType, poopColor } = content as IDiaper
        return (
          <div class='home-records-item-wrapper'>
            <div class='record-item-logo'>
              <Image src={IconFeedDiaper} class='item-logo-img'></Image>
            </div>
            <div>
              <div class='records-item-title'>{diaperTypeMap[type]?.name}</div>
              <div class='records-item-content content-diaper'>
                {poopTypeMap[poopType]?.name}{' '}
                <span
                  class='diaper-color'
                  style={{ background: poopColorMap[poopColor]?.ext }}
                ></span>
              </div>
            </div>
          </div>
        )
      }
    },
    [EnumFeedType.HEIGHT_WEIGHT]: {
      path: '/pages/sub-home/height-weight/index',
      render: (content: IFeedRecord['content']) => {
        let { weight, height } = content as IHeightWeight
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
            scrollTop={0}
          >
            <div class='home-records-scroll'>
              {state.feedRecords.map((record, index) => {
                if ('feedType' in record) {
                  let feedType = record.feedType
                  let strategy = feedTypeStrategy[feedType]
                  return (
                    <div
                      class={['home-records-item', 'records-item-' + feedType]}
                      key={index}
                      //@ts-ignore
                      onLongpress={() => onDeleteRecord(record)}
                      onClick={() => onRecordsItemClick(record)}
                    >
                      <div class='records-item-time'>{record.feedTimeStr}</div>
                      {strategy.render(record.content)}
                    </div>
                  )
                }
                return (
                  <div class='home-records-summary'>
                    <span class='records-summary-time'>{record.feedTimeStr}</span>
                    <div class='home-records-summary-wrapper '>
                      {feedTypeList.map((dict) => {
                        let code = dict.code as `${EnumFeedType}`
                        let summary = record[code]
                        if (!summary) return null
                        return (
                          <div class='summary-item'>
                            <span class='summary-item-label'>{feedTypeMap[code].name} </span>
                            <span class='content-number'>{summary.count}</span>次
                            {!!summary.content.volume && (
                              <>
                                <span class='ml-[5px]'>({summary.content.label}: </span>
                                <span class='content-number'>{summary.content.volume}</span>ml)
                              </>
                            )}
                          </div>
                        )
                      })}
                    </div>
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
