import { reactive, watch } from 'vue'
import { ScrollView } from '@tarojs/components'
import { useDidShow } from '@tarojs/taro'
import { dateDiff, durationFormatNoZero, useDate } from '@allkit/shared'
import { Empty, Icon, showPopup, Tag } from '@allkit/taro-h5-ui'
import { useCtxState } from '@allkit/use'
import { BabyInfo } from '@/components/baby-info'
import { FeedRecord, type SummaryFeedRecord } from '@/components/feed-record'
import { EnumFeedType } from '@/dict'
import { useAppStore } from '@/stores'
import { navigateTo, reLaunch, useDictList, useDictMap } from '@/use'
import { apiBabyList, apiGetFeedRecordListByDay } from '../api'
import { requestSubscribeAndReport } from '../utils/subscribe'
import { type IHomeState } from '../types'

/**  喂养记录 */
export const useRecords = () => {
  const [state, setState] = useCtxState<IHomeState>()

  const appStore = useAppStore()
  const currState = reactive({
    isRefresher: false
  })

  const feedTypeList = useDictList('FEED_TYPE')
  const milkTypeMap = useDictMap('MILK_TYPE')

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
    // 按天分页:size 为"几天一页",不传 startFeedTime/endFeedTime,接口自动按有记录的天分页
    const { current, size } = state.pagination
    const res = await apiGetFeedRecordListByDay({
      babyId: appStore.babyInfo.id,
      current,
      size
    })
    const list = res.list || []
    const totalDays = res.count || 0
    const now = Date.now()

    //格式化时间
    //把普通时间转化为今天,昨天的格式
    //同时汇总下喂养数据
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
      // 更新总天数,用于前端判断是否还有更多页
      state.pagination.total = totalDays
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
          volume: 0,
          duration: 0
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
    if (feedType === EnumFeedType.SLEEP) {
      const { duration } = record.content as ISleep
      feedTypeItem.content.duration += duration
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
    // 按天分页:已加载天数已达总数,不再加载
    if (state.pagination.current * state.pagination.size >= state.pagination.total) {
      return
    }
    getRecordList(false).finally(() => setState((state) => (state.loading = false)))
  }

  const onClickMore = () => {
    navigateTo({
      path: '/pages/sub-home/feed-records/index'
    })
  }

  function getBabyList() {
    if (!appStore.isLogin) return
    apiBabyList().then((list) => {
      if (!appStore.babyInfo.id) {
        const babyInfo = list?.[0] || {}
        appStore.setBabyInfo(babyInfo)
      }
    })
  }

  function onAddBaby() {
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
              getBabyList()
            }}
          ></BabyInfo>
        )
      }
    })
  }

  return {
    render: () => {
      return (
        <div class='home-records'>
          <div class='home-records-header'>
            <div class='header-title'>
              喂养记录
              <Tag
                size='mini'
                onClick={() => {
                  navigateTo({
                    path: '/pages/sub-home/weekly/index'
                  })
                  // 进入周报前先引导订阅（H5 静默跳过，失败不阻断）
                  requestSubscribeAndReport()
                }}
              >
                周报
              </Tag>
            </div>
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
              {!appStore.babyInfo.id && (
                <Tag class='home-records-tag' type='primary' round onClick={onAddBaby} size='large'>
                  请添加宝宝
                </Tag>
              )}
              {appStore.babyInfo.id && !state.feedRecords.length && (
                <Empty message='暂无喂养记录,请添加或刷新重试'></Empty>
              )}
              {state.feedRecords.map((record, index) => {
                if (!feedTypeList) return null
                return (
                  <FeedRecord
                    data={record}
                    key={index + record.feedTime}
                    onDeleted={getRecordList}
                  ></FeedRecord>
                )
              })}
            </div>
          </ScrollView>
        </div>
      )
    }
  }
}
