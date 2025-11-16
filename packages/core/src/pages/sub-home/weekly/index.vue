<script lang="tsx">
import { defineComponent, reactive, type VNode } from 'vue'
import { dateFormat, useDate } from '@mid-vue/shared'
import { Image, Navbar } from '@mid-vue/taro-h5-ui'
import itemIcon from '@/assets/images/img_baby_avatar.png'
import { EnumFeedType } from '@/dict'
import { useAppStore } from '@/stores'
import { useDictList, useDictMap } from '@/use'
import { apiGetReportWeek } from './api'
import { type IWeekly, type IWeeklyDetail, type IWeeklyState } from './types'

export default defineComponent({
  name: 'Report',
  setup() {
    const appStore = useAppStore()
    const date = useDate('2025-07-12').subtract(1, 'week')
    // 获取当前周的周一,周日
    const startFeedTime = useDate(date).day(1).format('YYYY-MM-DD')
    const endFeedTime = useDate(date).day(7).format('YYYY-MM-DD')
    const state = reactive<IWeeklyState>({
      weekly: { detailMap: {} } as IWeekly
    })

    const feedTypeMap = useDictMap('FEED_TYPE')
    const feedTypeList = useDictList('FEED_TYPE')

    //获取周报列表
    const getReportList = async () => {
      // 获取当前周的周一,周日
      state.weekly = await apiGetReportWeek({
        babyId: appStore.babyInfo?.id,
        startFeedTime,
        endFeedTime
      })
    }
    getReportList()

    const weeklyStrategy = {
      [EnumFeedType.MILK_BOTTLE]: {
        title: '奶瓶喂养',
        bgColor: '#FFF3F3',
        icon: itemIcon,
        items: [
          {
            title: '总次数',
            value: (detail: IWeeklyDetail) => detail.count,
            unit: '次'
          },
          {
            title: '总量',
            value: (detail: IWeeklyDetail) => detail.total,
            unit: '毫升'
          },
          {
            title: '平均次数(日)',
            value: (detail: IWeeklyDetail) => {
              return (detail.count / detail.days).toFixed(1)
            },
            unit: '次'
          },
          {
            title: '平均量(日)',
            value: (detail: IWeeklyDetail) => {
              return (detail.total / detail.days).toFixed(1)
            },
            unit: '毫升'
          }
        ],
        renderTips: (detail: IWeeklyDetail) => {
          const { dailyMaxCount = 0, dailyMaxTotal = 0, maxCountDate, maxTotalDate } = detail
          const tips = []
          if (dailyMaxCount > 0) {
            tips.push(
              <div class='tips-item'>
                <span class='text-[#433a51]'>{dateFormat(maxCountDate, 'MM月DD日')}</span>喂最多次(
                <span class='text-num-active'>{dailyMaxCount}</span>次)
              </div>
            )
          }
          if (dailyMaxTotal > 0) {
            tips.push(
              <div class='tips-item'>
                <span class='text-[#433a51]'>{dateFormat(maxTotalDate, 'MM月DD日')}</span>喂最多量(
                <span class='text-num-active'>{dailyMaxTotal}</span>毫升)
              </div>
            )
          }
          return <div class='report-tips mv-hairline--top'>{tips.map((item) => item)}</div>
        }
      },
      [EnumFeedType.BREAST_FEED_DIRECT]: {
        title: '母乳亲喂',
        bgColor: '#FFF3F3',
        icon: itemIcon,
        items: [
          {
            title: '总次数',
            value: (detail: IWeeklyDetail) => detail.count,
            unit: '次'
          },
          {
            title: '总时长',
            value: (detail: IWeeklyDetail) => detail.duration,
            unit: '毫秒'
          },
          {
            title: '最多次数(日)',
            value: (detail: IWeeklyDetail) => detail.dailyMaxCount,
            unit: '次'
          },
          {
            title: '最大时长(日)',
            value: (detail: IWeeklyDetail) => detail.dailyMaxDuration,
            unit: '毫秒'
          }
        ],
        renderTips: (detail: IWeeklyDetail) => {
          const { dailyMaxCount = 0, dailyMaxDuration = 0, maxCountDate, maxDurationDate } = detail
          const tips = []
          if (dailyMaxCount > 0) {
            tips.push(
              <div class='tips-item'>
                <span class='text-[#433a51]'>{dateFormat(maxCountDate, 'MM月DD日')}</span>喂最多次(
                <span class='text-num-active'>{dailyMaxCount}</span>次)
              </div>
            )
          }
          if (dailyMaxDuration > 0) {
            tips.push(
              <div class='tips-item'>
                <span class='text-[#433a51]'>{dateFormat(maxDurationDate, 'MM月DD日')}</span>
                喂最多时长(
                <span class='text-num-active'>{dailyMaxDuration}</span>毫秒)
              </div>
            )
          }
          return <div class='report-tips mv-hairline--top'>{tips.map((item) => item)}</div>
        }
      },
      [EnumFeedType.DIAPER]: {
        title: '换尿布',
        bgColor: '#FFF3F3',
        icon: itemIcon,
        items: [
          {
            title: '总次数',
            value: (detail: IWeeklyDetail) => detail.count,
            unit: '次'
          },

          {
            title: '最多次数(日)',
            value: (detail: IWeeklyDetail) => detail.dailyMaxCount,
            unit: '次'
          }
        ],
        renderTips: (detail: IWeeklyDetail) => {
          const { dailyMaxCount = 0, maxCountDate } = detail
          const tips = []
          if (dailyMaxCount > 0) {
            tips.push(
              <div class='tips-item'>
                <span class='text-[#433a51]'>{dateFormat(maxCountDate, 'MM月DD日')}</span>换最多次(
                <span class='text-num-active'>{dailyMaxCount}</span>次)
              </div>
            )
          }
          return <div class='report-tips mv-hairline--top'>{tips.map((item) => item)}</div>
        }
      }
    } as Record<
      string,
      {
        title: string
        bgColor: string
        icon: string
        items?: {
          title: string
          value: (detail: IWeeklyDetail) => string | VNode | number
          unit: string
        }[]
        renderTips?: (detail: IWeeklyDetail) => VNode
      }
    >
    const weeklyKeyList = Object.keys(weeklyStrategy)

    const otherFeedTypeList = feedTypeList.filter((dict) => !weeklyKeyList.includes(dict.code))

    return () => {
      return (
        <div class='report'>
          <Navbar position='fixed' clearfix={false}></Navbar>
          <div class='baby-report'>
            <Image src='mine/img_report_bg.png' class='baby-report-bg'></Image>
            <div class='baby-report-title'>宝宝周报 </div>
            <div class='baby-report-date'>{`${dateFormat(startFeedTime, 'YY-MM-DD')} - ${dateFormat(endFeedTime, 'MM-DD')}`}</div>
          </div>
          {Object.entries(state.weekly.detailMap).map(([feedType, detail], index) => {
            const strategy = weeklyStrategy[feedType]
            if (!strategy || !detail.count) return null

            return (
              <div class='report-feed-type' key={feedType + index}>
                <div class='feed-type-title'>
                  <div
                    class='title-icon'
                    style={{
                      backgroundColor: strategy.bgColor
                    }}
                  >
                    <Image src={strategy.icon} class='icon' />
                  </div>
                  <div class='title'>{strategy.title}</div>
                </div>
                <div class='feed-type-content'>
                  {strategy.items?.map((item, index) => {
                    return (
                      <div class='content-item' key={index}>
                        <div class='item-title'>{item.title}</div>
                        <div class='item-value'>
                          {item.value(detail)}
                          <span class='unit'>{item.unit}</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
                {strategy.renderTips?.(detail)}
              </div>
            )
          })}
          <div class='summary'>
            <div class='summary-title'>总结</div>
            <ul class='summary-list'>
              {otherFeedTypeList.map((dict) => {
                const detail = state.weekly.detailMap[dict.code as unknown as EnumFeedType]
                if (!detail || !detail.count) return null
                return (
                  <span class='summary-item' key={dict.code}>
                    {dict.name}:<span class='text-num-active'>{detail.count} 次</span>
                  </span>
                )
              })}
              {/* {summaryList.map((item, index) => (
                <li class='summary-item' key={index}>
                  {item}
                </li>
              ))} */}
            </ul>
          </div>
        </div>
      )
    }
  }
})
</script>
<style lang="scss">
@import './index.scss';
</style>
