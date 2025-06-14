import { useAppStore } from '@/stores'
import { apiFeedRecordList } from '../api'
import { useDate } from '@mid-vue/shared'
import { EnumFeedType } from '@/dict'
import { Chart } from '../../utils/chart'
import { useCtxState } from '@mid-vue/use'
import { IChartState } from '../types'

export function useBreastFeedChart() {
  let [state] = useCtxState<IChartState>()
  const appStore = useAppStore()

  /**
   * 初始化母乳喂养图表数据
   * @param code - 图表类型代码
   */
  async function initBreastFeed() {
    let code = this.childCode.value
    let list = await apiFeedRecordList<IBreastMilk>({
      babyId: appStore.babyInfo.id,
      feedType: EnumFeedType.BREAST_FEED_DIRECT,
      startFeedTime: state.form.startFeedTime + ' 00:00:00',
      endFeedTime: state.form.endFeedTime + ' 23:59:59'
    })

    let dateObj = {} as Record<string, any>
    //dateObj 是日期为key, 次数为value的对象
    // 使用连续日期作为可以, 否则会出现间隔
    let endFeedTime = useDate(state.form.endFeedTime)
    let totalDays = endFeedTime.diff(useDate(state.form.startFeedTime), 'day')

    for (let i = -totalDays; i < 1; i++) {
      let date = endFeedTime.add(i, 'day').format('MM-DD')
      dateObj[date] = {
        num: 0,
        volume: 0
      }
    }
    let axis = list.reduce((axis, feedRecord) => {
      let feedDate = useDate(feedRecord.feedTime).format('MM-DD')
      axis[feedDate] = {
        num: (axis[feedDate]?.num || 0) + 1,
        volume: (axis[feedDate]?.volume || 0) + feedRecord.content.duration
      }
      return axis
    }, dateObj)

    this.data.value = {
      xAxisData: Object.keys(axis),
      yAxisNum: Object.values(axis).map((item) => item.num),
      yAxisVolume: Object.values(axis).map((item) => item.volume)
    }

    initCHart(code, this.data.value)
  }

  function initCHart(
    code: string,
    axis: { xAxisData: any[]; yAxisNum: any[]; yAxisVolume: any[] }
  ) {
    let yData = code === '10' ? axis.yAxisNum : axis.yAxisVolume
    // 提前计算x轴间隔
    let xDataLength = axis.xAxisData.length
    let xInterval = Math.floor(xDataLength / 7)
    new Chart().init(`${EnumFeedType.BREAST_FEED_DIRECT}Canvas`, {
      hideYAxis: false,
      colors: ['#1aad19', '#74DAE5', '#F3AA59', '#ED7672', '#180d41'],
      title: {
        text: '',
        color: '#333333',
        size: 15
      },
      xAxis: {
        color: '#666A73',
        size: 10,
        data: axis.xAxisData,
        show: (index: number) => {
          if (xDataLength <= 7) {
            return true
          }
          return index % xInterval === 0
        }
      },
      series: [
        {
          name: appStore.babyInfo.nickname,
          category: 'line',
          toolTips: {
            show: true
          },
          data: yData
        }
      ]
    })
  }

  return {
    initBreastFeed
  }
}
