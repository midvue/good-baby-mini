import { EnumFeedType } from '@/dict'
import { useAppStore } from '@/stores'
import { useDate } from '@allkit/shared'
import { useCtxState } from '@allkit/use'
import { EnumLineType } from '../../utils/chart'
import {
  CHART_Y_AXIS_WIDTH,
  getScrollableContentWidth,
  createXAxisShowFn,
  renderSplitCanvas
} from '../helpers/chartLayout'
import { apiFeedRecordList } from '../api'
import { IChartState } from '../types'

type ScrollableChartStrategy = {
  data: { value: unknown }
  yAxisCanvasId: { value: string }
  contentCanvasId: { value: string }
  chartContentWidth?: { value: number }
}

export function useDiaperChart() {
  let [state] = useCtxState<IChartState>()
  const appStore = useAppStore()

  async function initDiaper(this: ScrollableChartStrategy) {
    let list = await apiFeedRecordList<IMilkBottle>({
      babyId: appStore.babyInfo.id,
      feedType: EnumFeedType.DIAPER,
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
      dateObj[date] = 0
    }

    let axis = list.reduce((axis, feedRecord) => {
      let feedDate = useDate(feedRecord.feedTime).format('MM-DD')
      axis[feedDate] = (axis[feedDate] || 0) + 1
      return axis
    }, dateObj)

    const chartData = {
      xAxisData: Object.keys(axis),
      yAxisData: Object.values(axis)
    }
    this.data.value = chartData

    await initCHart.call(this, chartData)
  }

  /**
   * 初始化尿布图表
   */
  async function initCHart(this: ScrollableChartStrategy, axis: { xAxisData: any[]; yAxisData: any[] }) {
    // 求平均值
    let average = (
      axis.yAxisData.reduce((sum, num) => sum + num, 0) / axis.yAxisData.length
    ).toFixed(1)
    let xDataLength = axis.xAxisData.length
    const chartContentWidth = getScrollableContentWidth(xDataLength)
    if (this.chartContentWidth) this.chartContentWidth.value = chartContentWidth
    const chartConfig = {
      chart: {
        yAxisMinValue: 0
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
          data: axis.yAxisData
        },
        {
          name: ' ',
          category: 'line',
          type: EnumLineType.DASHED,
          toolTips: {
            show: (index: number) => {
              return index === axis.yAxisData.length - 1
            },
            formatter: () => {
              return `平均：${average}次`
            }
          },
          data: axis.yAxisData.map(() => +average)
        },
        {
          name: ' ',
          category: 'line',
          toolTips: {
            show: false
          },
          data: axis.yAxisData.map(() => +0)
        }
      ]
    }

    await renderSplitCanvas(EnumFeedType.DIAPER, chartConfig, CHART_Y_AXIS_WIDTH, chartContentWidth, {
      yAxisCanvasId: this.yAxisCanvasId.value,
      contentCanvasId: this.contentCanvasId.value
    })
  }

  return {
    initDiaper
  }
}
