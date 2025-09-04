<script lang="tsx">
import { defineComponent, reactive } from 'vue'
import { useDate } from '@mid-vue/shared'
import { Image, Navbar } from '@mid-vue/taro-h5-ui'
import itemIcon from '@/assets/images/img_baby_avatar.png'
import { useAppStore } from '@/stores'
import { useDictMap } from '@/use'
import { EnumFeedType } from '@/dict'
import { apiGetReportWeek } from './api'
import { type IWeekly, type IWeeklyState } from './types'

export default defineComponent({
  name: 'Report',
  setup() {
    const appStore = useAppStore()
    const date = useDate('2025-07-10').format('YYYY-MM-DD')
    // 获取当前周的周一,周日
    const startFeedTime = useDate(date).startOf('week').format('YYYY-MM-DD')
    const endFeedTime = useDate(date).endOf('week').format('YYYY-MM-DD')
    const state = reactive<IWeeklyState>({
      weekly: {} as IWeekly
    })

    const feedTypeMap = useDictMap('FEED_TYPE')
    console.log(feedTypeMap)

    //获取周报列表
    const getReportList = async () => {
      // 获取当前周的周一,周日
      state.weekly = await apiGetReportWeek({
        babyId: appStore.babyInfo?.id,
        startFeedTime,
        endFeedTime
      })
      console.log(state.weekly)
    }
    getReportList()

    const weeklyStrategy = {
      [EnumFeedType.MILK_BOTTLE]: {
        title: '奶瓶喂养',
        bgColor: '#FFF3F3',
        icon: itemIcon
      },
      [EnumFeedType.BREAST_FEED_DIRECT]: {
        title: '母乳亲喂',
        bgColor: '#FFF3F3',
        icon: itemIcon
      }
    }

    const reportList = [
      {
        title: '喂养',
        bgColor: '#FFF3F3',
        icon: itemIcon,
        items: [
          {
            title: '总量',
            value: '1000',
            unit: 'ml'
          },
          {
            title: '总量',
            value: '1000',
            unit: 'ml'
          },
          {
            title: '总量',
            value: '1000',
            unit: 'ml'
          },
          {
            title: '总量',
            value: '1000',
            unit: 'ml'
          }
        ]
      },
      {
        title: '喂养',
        bgColor: '#F9F2E7',
        icon: itemIcon,
        items: [
          {
            title: '总量',
            value: '1000',
            unit: 'ml'
          },
          {
            title: '总量',
            value: '1000',
            unit: 'ml'
          }
        ]
      }
    ]
    const summaryList = ['本周宝宝的喂养情况良好', '体重增长明显', '精神状态活泼']
    return () => {
      return (
        <div class='report'>
          <Navbar position='fixed' clearfix={false}></Navbar>
          <div class='baby-report'>
            <Image src='mine/img_report_bg.png' class='baby-report-bg'></Image>
            <div class='baby-report-title'>宝宝周报 </div>
            <div class='baby-report-date'>{`${startFeedTime} - ${endFeedTime}`}</div>
          </div>
          {reportList.map((item, index) => {
            return (
              <div class='report-item' key={index}>
                <div class='title-content'>
                  <div
                    class='icon-container'
                    style={{
                      backgroundColor: item.bgColor
                    }}
                  >
                    <Image src={item.icon} class='icon' />
                  </div>
                  <div class='title'>{item.title}</div>
                </div>
                <div class='content'>
                  {item.items.map((item, index) => {
                    return (
                      <div class='content-item' key={index}>
                        <div class='item-title'>{item.title}</div>
                        <div class='item-value'>
                          {item.value}
                          <span class='unit'>{item.unit}</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
          <div class='summary'>
            <div class='summary-title'>总结</div>
            <ul class='summary-list'>
              {summaryList.map((item, index) => (
                <li class='summary-item' key={index}>
                  {item}
                </li>
              ))}
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
