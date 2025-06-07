import { useAppStore } from '@/stores'
import { apiFeedRecordList } from '../api' // 假设存在该 API
import { useDate } from '@mid-vue/shared'
import { EnumFeedType } from '@/dict'
import { EnumLineType, init } from '../../utils/chart'
import { useCtxState } from '@mid-vue/use'
import { IChartState } from '../types'

export function useDiaperChart() {
  let [state] = useCtxState<IChartState>()
  const appStore = useAppStore()

  async function initDiaper() {
    let list = await apiFeedRecordList<IMilkBottle>({
      babyId: appStore.babyInfo.id,
      feedType: EnumFeedType.DIAPER,
      startFeedTime: state.form.startFeedTime + ' 00:00:00',
      endFeedTime: state.form.endFeedTime + ' 23:59:59'
    })

    let dateObj = {} as Record<string, any>
    //dateObj 是日期为key, 次数为value的对象
    // 使用连续日期作为可以, 否则会出现间隔
    let totalDays = useDate(state.form.endFeedTime).diff(useDate(state.form.startFeedTime), 'days')

    for (let i = -totalDays; i < 1; i++) {
      let date = useDate().add(i, 'day').format('MM-DD')
      dateObj[date] = 0
    }

    let axis = list.reduce((axis, feedRecord) => {
      let feedDate = useDate(feedRecord.feedTime).format('MM-DD')
      axis[feedDate] = (axis[feedDate] || 0) + 1
      return axis
    }, dateObj)

    this.data.value = {
      xAxisData: Object.keys(axis),
      yAxisData: Object.values(axis)
    }

    initCHart(this.data.value)
  }

  /**
   * 初始化尿布图表
   */
  function initCHart(axis: { xAxisData: any[]; yAxisData: any[] }) {
    // 求平均值
    let average = (
      axis.yAxisData.reduce((sum, num) => sum + num, 0) / axis.yAxisData.length
    ).toFixed(1)

    init(`${EnumFeedType.DIAPER}Canvas`, {
      hideYAxis: false,
      color: ['#1aad19', '#74DAE5', '#F3AA59', '#ED7672', '#180d41'],
      title: {
        text: '',
        color: '#333333',
        size: 15
      },
      xAxis: {
        color: '#666A73',
        size: 10,
        data: axis.xAxisData
      },
      series: [
        {
          name: ' ',
          category: '',
          toolTips: {
            show: false
          },
          data: axis.yAxisData.map(() => 0)
        },
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
        }
      ]
    })
  }

  return {
    initDiaper
  }
}
