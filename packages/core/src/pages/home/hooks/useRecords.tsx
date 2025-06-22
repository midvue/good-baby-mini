import { reactive, watch } from 'vue'
import { ScrollView } from '@tarojs/components'
import { useDidShow } from '@tarojs/taro'
import { dateDiff, durationFormatNoZero, useDate } from '@mid-vue/shared'
import { Empty, Icon, Image, showDialog, Tag } from '@mid-vue/taro-h5-ui'
import { useCtxState } from '@mid-vue/use'
import { EnumFeedType } from '@/dict'
import { useAppStore } from '@/stores'
import { navigateTo, reLaunch, useDictList, useDictMap } from '@/use'
import IconFeedDiaper from '@/assets/images/icon_feed_diaper.png'
import iconFeedHeight from '@/assets/images/icon_feed_height.png'
import iconFeedMilk from '@/assets/images/icon_feed_milk.png'
import iconFeedBreast from '@/assets/images/icon_feed_breast.png'
import iconFeedFood from '@/assets/images/icon_feed_food.png'
import iconFeedJaundice from '@/assets/images/icon_feed_jaundice.png'
import iconFeedSleep from '@/assets/images/icon_feed_sleep.png'
import { apiDeleteFeedRecord, apiGetFeedRecordList } from '../api'
import { type SummaryFeedRecord, type IHomeState } from '../types'

/**  喂养记录 */
export const useRecords = () => {
  const [state, setState] = useCtxState<IHomeState>()

  const appStore = useAppStore()
  const currState = reactive({
    isRefresher: false
  })

  const feedTypeList = useDictList('FEED_TYPE')
  const feedTypeMap = useDictMap('FEED_TYPE')
  const milkTypeMap = useDictMap('MILK_TYPE')
  const diaperTypeMap = useDictMap('DIAPER_TYPE')
  const poopTypeMap = useDictMap('POOP_TYPE')
  const poopColorMap = useDictMap('POOP_COLOR')
  const sleepTypeMap = useDictMap('SLEEP_TYPE')
  const sleepQualityMap = useDictMap('SLEEP_QUALITY')
  const foodTypeMap = useDictMap('FOOD_TYPE')
  const foodDurationMap = useDictMap('FOOD_DURATION')
  const foodFeedbackMap = useDictMap('FOOD_FEEDBACK')
  const foodAmountUnitMap = useDictMap('FOOD_UNIT')

  watch(
    () => appStore.babyInfo.id,
    (id) => {
      if (!id) return
      if (!feedTypeList) {
        reLaunch({
          path: ENV_HOME_URL
        })
        return
      }
      getRecordList()
    }
  )

  const startFeedTime = useDate().subtract(3, 'day').format('YYYY-MM-DD 00:00:00')
  const endFeedTime = useDate().format('YYYY-MM-DD 23:59:59')
  let dayMap = {} as Record<string, SummaryFeedRecord>
  /** 获取喂养记录 */
  async function getRecordList(isRefresh = true) {
    if (!appStore.isLogin || !appStore.babyInfo.id) return
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
      babyId: appStore.babyInfo.id,
      ...state.pagination
    })
    const list = res.list || []
    const now = Date.now()

    //格式化时间
    const feedRecords = list.reduce(
      (records, record) => {
        /** 喂养类型 */
        const duration = dateDiff(now, record.feedTime)
        const feedDay = useDate(record.feedTime)
        const isToday = feedDay.isSame(useDate(), 'day')
        const yesterday = feedDay.isSame(useDate().subtract(1, 'day'), 'day')
        const key = isToday ? '今天' : yesterday ? '昨天' : feedDay.format('MM月DD日')
        /** 处理汇总 */
        const { isAdd, summary } = formatSummary(key, record)
        if (isAdd) {
          records.push(summary)
        }
        //普通Record明细
        const feedTimeStr = `${
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
        //保存最后一次记录
        state.feedRecords = feedRecords
      } else {
        state.feedRecords = state.feedRecords.concat(feedRecords)
      }
    })
  }

  /** 格式化每日汇总 */
  function formatSummary(key: string, record: IFeedRecord) {
    const feedType = record.feedType
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
    if (feedType === EnumFeedType.MILK_BOTTLE) {
      const { volume, type } = record.content as IMilkBottle
      feedTypeItem.content.label = milkTypeMap[type]?.name || ''
      feedTypeItem.content.volume += volume
    }
    return { isAdd, summary }
  }

  useDidShow(() => {
    getRecordList()
  })
  const onRefresh = async () => {
    currState.isRefresher = true
    await getRecordList()
    currState.isRefresher = false
  }
  const onLoadMore = () => {
    getRecordList(false).finally(() => setState((state) => (state.loading = false)))
  }

  const feedTypeStrategy = {
    /** 奶粉 */
    [EnumFeedType.MILK_BOTTLE]: {
      path: '/pages/sub-home/feed-milk/index',
      render: (content: IFeedRecord['content']) => {
        const { volume, type } = content as IMilkBottle
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
    /** 母乳亲喂 */
    [EnumFeedType.BREAST_FEED_DIRECT]: {
      path: '/pages/sub-home/feed-milk/index',
      render: (content: IFeedRecord['content']) => {
        const { duration, leftDuration, rightDuration } = content as IBreastMilk
        return (
          <div class='home-records-item-wrapper'>
            <div class='record-item-logo'>
              <Image src={iconFeedBreast} class='item-logo-img'></Image>
            </div>
            <div>
              <div class='records-item-title'>
                母乳亲喂
                <span class='item-title-duration'>
                  (总时长:
                  {durationFormatNoZero(duration, { unit: 's', format: 'm分钟s秒' })})
                </span>
              </div>
              <div class='records-item-content'>
                <div v-show={leftDuration} class='mr-[5px]'>
                  左侧:
                  <span>
                    {durationFormatNoZero(leftDuration, { unit: 's', format: 'm分钟s秒' })}
                  </span>
                </div>
                <div v-show={rightDuration}>
                  右侧:
                  <span>
                    {durationFormatNoZero(rightDuration, { unit: 's', format: 'm分钟s秒' })}
                  </span>
                </div>
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
        const { type, poopType, poopColor } = content as IDiaper
        return (
          <div class='home-records-item-wrapper'>
            <div class='record-item-logo'>
              <Image src={IconFeedDiaper} class='item-logo-img'></Image>
            </div>
            <div>
              <div class='records-item-title'>{diaperTypeMap[type]?.name}</div>
              <div class='records-item-content content-diaper'>
                {poopTypeMap[poopType]?.name}
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
    /** 身高体重 */
    [EnumFeedType.HEIGHT_WEIGHT]: {
      path: '/pages/sub-home/height-weight/index',
      render: (content: IFeedRecord['content']) => {
        const { weight, height } = content as IHeightWeight
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
    },

    [EnumFeedType.JAUNDICE]: {
      path: '/pages/sub-home/jaundice/index',
      render: (content: IFeedRecord['content']) => {
        const { unit, value } = content as IJaundice
        return (
          <div class='home-records-item-wrapper'>
            <div class='record-item-logo'>
              <Image src={iconFeedJaundice} class='item-logo-img'></Image>
            </div>
            <div>
              <div class='records-item-title'>
                黄疸: {value} {unit}
              </div>
            </div>
          </div>
        )
      }
    },
    [EnumFeedType.SLEEP]: {
      path: '/pages/sub-home/sleep/index',
      render: (content: IFeedRecord['content']) => {
        const { duration, sleepType, quality } = content as ISleep
        return (
          <div class='home-records-item-wrapper'>
            <div class='record-item-logo'>
              <Image src={iconFeedSleep} class='item-logo-img'></Image>
            </div>
            <div>
              <div class='records-item-title'>
                睡眠时长: {durationFormatNoZero(duration, { unit: 's', format: 'H小时m分钟s秒' })}
              </div>
              <div class='records-item-content'>
                <span>入睡方式: {sleepTypeMap[sleepType]?.name}</span>
                <span> 睡眠质量: {sleepQualityMap[quality]?.name}</span>
              </div>
            </div>
          </div>
        )
      }
    },
    [EnumFeedType.FOOD]: {
      path: '/pages/sub-home/food/index',
      render: (content: IFeedRecord['content']) => {
        const { duration, type, foodAmount, foodAmountUnit, feedback } = content as IFood
        return (
          <div class='home-records-item-wrapper'>
            <div class='record-item-logo'>
              <Image src={iconFeedFood} class='item-logo-img'></Image>
            </div>
            <div>
              <div class='records-item-title'>
                辅食:
                <span class='item-title-duration'>
                  {foodTypeMap[type]?.name}
                  {foodAmount}
                  {foodAmountUnitMap[foodAmountUnit]?.name}
                </span>
              </div>
              <div class='records-item-content'>
                <div class='mr-[5px]'></div>
                <div>
                  时长:{foodDurationMap[duration]?.name} 宝宝反馈:
                  {foodFeedbackMap[feedback]?.name}
                </div>
              </div>
            </div>
          </div>
        )
      }
    }
  } as const

  const onRecordsItemClick = (record: IFeedRecord) => {
    const strategy = feedTypeStrategy[record.feedType]
    navigateTo({
      path: strategy.path,
      query: record
    })
  }
  const onDeleteRecord = (record: IFeedRecord) => {
    showDialog({
      title: '删除记录',
      render: () => '确认删除 \n' + record.feedTimeStr + ' 的记录吗？',
      onConfirm: async () => {
        await apiDeleteFeedRecord(record.id)
        getRecordList()
      }
    })
  }
  const onClickMore = () => {
    navigateTo({
      path: '/pages/sub-home/feed-records/index'
    })
  }

  return {
    render: () => {
      return (
        <div class='home-records'>
          <div class='home-records-header'>
            <div class='header-title'>喂养记录</div>
            <div class='header-more' v-show={state.feedRecords.length} onClick={onClickMore}>
              更多<Icon name='arrow'></Icon>
            </div>
          </div>

          <ScrollView
            class='home-records-wrapper'
            scroll-y
            refresherEnabled
            refresher-triggered={currState.isRefresher}
            onRefresherrefresh={onRefresh}
            onScrolltolower={onLoadMore}
            showScrollbar={false}
            enhanced
            scrollTop={0}
          >
            <div class='home-records-scroll'>
              {!state.feedRecords.length && <Empty message='暂无喂养记录,请添加或刷新重试'></Empty>}
              {state.feedRecords.map((record, index) => {
                if (!feedTypeList) return null
                if ('feedType' in record) {
                  const feedType = record.feedType
                  const strategy = feedTypeStrategy[feedType]
                  return (
                    <div
                      class={['home-records-item', 'records-item-' + feedType]}
                      key={index}
                      //@ts-ignore
                      onLongpress={() => onDeleteRecord(record)}
                      onClick={() => onRecordsItemClick(record)}
                    >
                      <div class='records-item-time'>{record.feedTimeStr}</div>
                      {strategy?.render(record.content)}
                    </div>
                  )
                }
                return (
                  <div class='home-records-summary'>
                    <span class='records-summary-time'>{record.feedTimeStr}</span>
                    <div class='home-records-summary-wrapper '>
                      {feedTypeList.map((dict, index) => {
                        const code = dict.code as `${EnumFeedType}`
                        const summary = record[code]
                        if (!summary) return null
                        return (
                          <div class='summary-item' key={code + index}>
                            <span class='summary-item-label'>{feedTypeMap[code]?.name} </span>
                            <span class='content-number'>{summary.count}</span> 次
                            {!!summary.content.volume && (
                              <>
                                <span class='ml-[5px]'>({summary.content.label}: </span>
                                <span class='content-number'>{summary.content.volume}</span> ml)
                              </>
                            )}
                            {(summary.label === EnumFeedType.MILK_BOTTLE ||
                              summary.label === EnumFeedType.BREAST_FEED_DIRECT ||
                              summary.label === EnumFeedType.HEIGHT_WEIGHT ||
                              summary.label === EnumFeedType.DIAPER) && (
                              <Tag
                                size='small'
                                class='ml-[5px]'
                                onClick={() => {
                                  navigateTo({
                                    path: '/pages/sub-summary/chart/index',
                                    query: {
                                      feedType: code
                                    }
                                  })
                                }}
                              >
                                分析
                              </Tag>
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
