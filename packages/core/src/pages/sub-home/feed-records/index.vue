<script lang="tsx">
import { useDictList, useDictMap, useRoute } from '@/use'
import { Empty, Navbar, TabPane, Tabs } from '@mid-vue/taro-h5-ui'
import { defineComponent, reactive } from 'vue'
import { EnumFeedType } from '@/dict'
import { apiGetFeedRecordList } from './api'
import { dateDiff, durationFormatNoZero, useDate } from '@mid-vue/shared'
import { useAppStore } from '@/stores'
import type { SummaryFeedRecord } from './types'
import { ScrollView } from '@tarojs/components'
import { FeedRecord } from './components/feed-record'
export default defineComponent({
  name: 'feed-records',
  setup() {
    let appStore = useAppStore()

    const state = reactive({
      tabActive: EnumFeedType.MILK_BOTTLE,
      feedRecords: [] as (IFeedRecord | SummaryFeedRecord)[],
      pagination: {
        current: 1,
        size: 16,
        total: 0
      }
    })
    let feedTypeList = useDictList('FEED_TYPE')
    let milkTypeMap = useDictMap('MILK_TYPE')

    let startFeedTime = useDate().subtract(1, 'day').format('YYYY-MM-DD 00:00:00')
    let endFeedTime = useDate().format('YYYY-MM-DD 23:59:59')
    let dayMap = {} as Record<string, SummaryFeedRecord>

    async function init() {
      dayMap = {}
      const res = await apiGetFeedRecordList({
        feedType: state.tabActive,
        startFeedTime,
        endFeedTime,
        babyId: appStore.babyInfo.id,
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
      state.feedRecords = feedRecords
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
      if (feedType === EnumFeedType.MILK_BOTTLE) {
        let { volume, type } = record.content as IMilkBottle
        feedTypeItem.content.label = milkTypeMap[type]?.name || ''
        feedTypeItem.content.volume += volume
      }
      return { isAdd, summary }
    }
    init()

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
          </div>
          <ScrollView class='feed-records-wrapper' scroll-y scrollTop={0}>
            {!state.feedRecords.length && <Empty></Empty>}
            {state.feedRecords.map((record, index) => {
              return <FeedRecord data={record} key={index}></FeedRecord>
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
