<script lang="tsx">
import { defineComponent, reactive, type VNode } from 'vue'
import { dateFormat, useDate } from '@allkit/shared'
import { Image, Navbar } from '@allkit/taro-h5-ui'
import itemIcon from '@/assets/images/img_baby_avatar.png'
import { EnumFeedType } from '@/dict'
import { useAppStore } from '@/stores'
import { useDictList, useDictMap } from '@/use'
import { apiGetReportWeek, apiPostRelation } from './api'
import { type IWeekly, type IWeeklyDetail, type IWeeklyState } from './types'

export default defineComponent({
  name: 'Report',
  setup() {
    const appStore = useAppStore()
    const date = useDate().subtract(1, 'week')
    // 获取当前周的周一,周日
    const startFeedTime = useDate(date).day(1).format('YYYY/MM/DD')
    const endFeedTime = useDate(date).day(7).format('YYYY/MM/DD')
    const state = reactive<IWeeklyState>({
      weekly: { detailMap: {}, userStat: {} } as IWeekly,
      userMap: {}
    })

    const relationMap = useDictMap('FAMILY_RELATION')
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

    const getFamilyList = () => {
      apiPostRelation({
        id: appStore.babyInfo?.familyId
      }).then((list) => {
        state.userMap = list.reduce(
          (prev, cur) => {
            prev[cur.userId] = {
              relation: cur.relation
            }
            return prev
          },
          {} as IWeeklyState['userMap']
        )
        console.log(state.userMap)
      })
    }

    function init() {
      Promise.all([getFamilyList(), getReportList()])
    }

    init()

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
                <span class='text-[#433a51]'>{dateFormat(maxCountDate, 'MM月DD日')}</span>
                最多喂了(
                <span class='text-num-active'>{dailyMaxCount}</span>次)
              </div>
            )
          }
          if (dailyMaxTotal > 0) {
            tips.push(
              <div class='tips-item'>
                <span class='text-[#433a51]'>{dateFormat(maxTotalDate, 'MM月DD日')}</span>
                最多喂了(
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
                <span class='text-[#433a51]'>{dateFormat(maxCountDate, 'MM月DD日')}</span>最多喂了(
                <span class='text-num-active'>{dailyMaxCount}</span>次)
              </div>
            )
          }
          if (dailyMaxDuration > 0) {
            tips.push(
              <div class='tips-item'>
                <span class='text-[#433a51]'>{dateFormat(maxDurationDate, 'MM月DD日')}</span>
                最多喂了(
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
                <span class='text-[#433a51]'>{dateFormat(maxCountDate, 'MM月DD日')}</span>最多换了(
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

    /** 渲染最晚喂信息 */
    const renderLastFeedInfo = () => {
      const relation = state.userMap[state.weekly.lastFeedUid]?.relation || ''
      if (!relation) return null
      const name = relationMap[relation].name || ''
      if (!name) return null
      return (
        <li>
          <span class='summary-item'>
            <span class='text-[#433a51] font-bold'>{name}</span> 在凌晨:
            <span class='text-num-active'>
              {dateFormat(state.weekly.lastFeedTime, 'MM-DD HH:mm:ss')}
            </span>
            起来喂养, 带娃不易!
          </span>
        </li>
      )
    }

    return () => {
      return (
        <div class='report'>
          <Navbar position='fixed' clearfix={false} title='奶娃星球'></Navbar>
          <div class='baby-report'>
            <Image src='mine/img_report_bg.png' class='baby-report-bg'></Image>
            <div class='baby-report-title'>宝宝周报 </div>
            <div class='baby-report-date'>{`${startFeedTime} - ${dateFormat(endFeedTime, 'MM/DD')}`}</div>
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
              <li>
                <span class='summary-item'>
                  总次数: <span class='text-num-active'>{state.weekly.count} </span>次
                </span>
                {Object.entries(state.weekly.userStat).map(([key, stat]) => {
                  const relation = state.userMap[key]?.relation
                  if (!relation) return null
                  return (
                    <span class='summary-item' key={key}>
                      {relationMap[relation].name}喂:
                      <span class='text-num-active'>{stat.count} </span>次
                    </span>
                  )
                })}
              </li>
              {renderLastFeedInfo()}
              <li>
                {otherFeedTypeList.map((dict) => {
                  const detail = state.weekly.detailMap[dict.code as unknown as EnumFeedType]
                  if (!detail || !detail.count) return null
                  return (
                    <span class='summary-item' key={dict.code}>
                      {dict.name}:<span class='text-num-active'>{detail.count} </span>次
                    </span>
                  )
                })}
              </li>

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
