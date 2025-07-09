<script lang="tsx">
import { defineComponent, reactive, nextTick, watch } from 'vue'
import { ScrollView } from '@tarojs/components'
import { useDidShow } from '@tarojs/taro'
import { useDate } from '@mid-vue/shared'
import { Empty, Navbar, TabPane, Tabs } from '@mid-vue/taro-h5-ui'
import { EnumFeedType } from '@/dict'
import { useAppStore } from '@/stores'
import { useDictList, useDictMap } from '@/use'
import { FeedRecord, type SummaryFeedRecord } from '@/components/feed-record'
import { apiGetFeedRecordDays, apiGetFeedRecordList } from './api'
import Calender from './components/calendar/Calendar.vue'
import { useCalendar } from './components/calendar/hooks/useCalendar'
import { type ICalendarItem } from './components/calendar/type'
export default defineComponent({
  name: 'FeedRecords',
  setup() {
    const appStore = useAppStore()

    const state = reactive({
      tabActive: -1,
      feedRecords: [] as (IFeedRecord | SummaryFeedRecord)[],
      pagination: {
        current: 1,
        size: 16,
        total: 0
      },
      currentDate: useDate().toDate(), //当前日期
      expended: false,
      clist: [] as ICalendarItem[]
    })
    let feedTypeList = useDictList('FEED_TYPE')
    feedTypeList = [
      {
        code: '-1',
        name: '全部'
      },
      ...feedTypeList
    ]
    const milkTypeMap = useDictMap('MILK_TYPE')

    let dayMap = {} as Record<string, SummaryFeedRecord>

    async function init() {
      dayMap = {}
      const res = await apiGetFeedRecordList({
        ...(state.tabActive !== -1 && { feedType: state.tabActive }),
        startFeedTime: useDate(state.currentDate).format('YYYY-MM-DD 00:00:00'),
        endFeedTime: useDate(state.currentDate).format('YYYY-MM-DD 23:59:59'),
        babyId: appStore.babyInfo.id,
        ...state.pagination
      })
      const list = res.list || []

      //格式化时间
      const feedRecords = list.reduce(
        (records, record) => {
          /** 喂养类型 */
          const feedDay = useDate(record.feedTime)

          const key = feedDay.format('YYYY年MM月DD日')
          /** 处理汇总 */
          const { isAdd, summary } = formatSummary(key, record)
          if (isAdd) {
            records.push(summary)
          }
          //普通Record明细
          const feedTimeStr = feedDay.format('HH:mm')

          records.push({ ...record, feedTimeStr })

          return records
        },
        [] as (IFeedRecord | SummaryFeedRecord)[]
      )
      state.feedRecords = feedRecords
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
      init()
    })

    const initDate = async (date: Date) => {
      const list = await apiGetFeedRecordDays({
        startFeedTime: useDate(date).startOf('month').format('YYYY-MM-DD 00:00:00'),
        endFeedTime: useDate(date).endOf('month').format('YYYY-MM-DD 23:59:59'),
        babyId: appStore.babyInfo.id
      })
      state.clist = useCalendar(date, list || [])
    }
    initDate(state.currentDate)
    const handleDateChange = (date: Date) => {
      nextTick(() => {
        const selectedMonth = useDate(date).format('YYYY-MM')
        const currentMonth = useDate(state.currentDate).format('YYYY-MM')
        // 若月份不同，则调用 initDate
        if (selectedMonth !== currentMonth) {
          initDate(date)
        }
        state.currentDate = date
      })
    }

    watch(
      () => state.currentDate,
      () => {
        init()
      },
      { deep: true }
    )

    return () => {
      return (
        <div class='feed-records'>
          <Navbar
            title='更多记录'
            clearfix
            defaultConfig={{
              frontColor: '#000000',
              backgroundColor: 'fff8e5'
            }}
          ></Navbar>

          <div class='feed-records-tabs'>
            {/* 使用 ScrollView 包裹 Tabs 以支持滚动 */}
            <ScrollView
              scroll-x
              scrollWithAnimation
              style={{
                whiteSpace: 'nowrap'
              }}
            >
              <Tabs v-model={state.tabActive} onChange={() => init()} border={false}>
                {feedTypeList.map((feedType) => {
                  return (
                    <TabPane
                      label={feedType.name}
                      key={feedType.code}
                      name={+feedType.code}
                    ></TabPane>
                  )
                })}
              </Tabs>
            </ScrollView>
          </div>

          <Calender
            current={state.currentDate}
            expended={state.expended}
            list={state.clist}
            onChange={handleDateChange}
          />
          <ScrollView class='feed-records-wrapper' scroll-y scrollTop={0}>
            {!state.feedRecords.length && <Empty></Empty>}
            {state.feedRecords.map((record, index) => {
              return <FeedRecord data={record} key={index} onDeleted={init}></FeedRecord>
            })}
          </ScrollView>
        </div>
      )
    }
  }
})
</script>
<style lang="scss">
@import './index.scss';
</style>
