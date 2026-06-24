import { useAppStore } from '@/stores'
import { apiFeedRecordList } from '../api'
import { useDate } from '@allkit/shared'
import { EnumFeedType } from '@/dict'
import { useCtxState } from '@allkit/use'
import { IChartState } from '../types'
import {
  SCROLLABLE_Y_AXIS_WIDTH,
  getScrollableContentWidth,
  createXAxisShowFn,
  renderSplitCanvas
} from '../helpers/chartLayout'

type ScrollableChartStrategy = {
  childCode: { value: string }
  data: { value: unknown }
  yAxisCanvasId: { value: string }
  contentCanvasId: { value: string }
  chartYAxisWidth?: { value: number }
  chartContentWidth?: { value: number }
}

export function useBreastFeedChart() {
  let [state] = useCtxState<IChartState>()
  const appStore = useAppStore()

  /**
   * 初始化母乳喂养图表数据
   * @param code - 图表类型代码
   */
  async function initBreastFeed(this: ScrollableChartStrategy) {
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

    const chartData = {
      xAxisData: Object.keys(axis),
      yAxisNum: Object.values(axis).map((item) => item.num),
      yAxisVolume: Object.values(axis).map((item) => item.volume)
    }
    this.data.value = chartData

    await initCHart.call(this, code, chartData)
  }

  async function initCHart(
    this: ScrollableChartStrategy,
    code: string,
    axis: { xAxisData: any[]; yAxisNum: any[]; yAxisVolume: any[] }
  ) {
    let yData = code === '10' ? axis.yAxisNum : axis.yAxisVolume
    let xDataLength = axis.xAxisData.length
    const chartContentWidth = getScrollableContentWidth(xDataLength)
    if (this.chartYAxisWidth) this.chartYAxisWidth.value = SCROLLABLE_Y_AXIS_WIDTH
    if (this.chartContentWidth) this.chartContentWidth.value = chartContentWidth
    const chartConfig = {
      chart: {
        yAxisMinValue: 0,
        yAxisInteger: true
      },
      colors: ['#1aad19', '#74DAE5', '#F3AA59', '#ED7672', '#180d41'],
      xAxis: {
        data: axis.xAxisData,
        color: '#333',
        size: 12,
        show: createXAxisShowFn(xDataLength)
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
    }

    await renderSplitCanvas(
      EnumFeedType.BREAST_FEED_DIRECT,
      chartConfig,
      SCROLLABLE_Y_AXIS_WIDTH,
      chartContentWidth,
      {
        yAxisCanvasId: this.yAxisCanvasId.value,
        contentCanvasId: this.contentCanvasId.value
      }
    )
  }

  return {
    initBreastFeed
  }
}
