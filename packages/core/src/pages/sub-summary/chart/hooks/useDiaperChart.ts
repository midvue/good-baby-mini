import { useAppStore } from '@/stores'
import { apiFeedRecordList } from '../api' // 假设存在该 API
import { useDate } from '@mid-vue/shared'
import { EnumFeedType } from '@/dict'
import { EnumLineType, init } from '../../utils/chart'

export function useDiaperChart() {
  const appStore = useAppStore()

  async function initDiaper() {
    if (this.data.value) {
      initDiaperChart(this.data.value)
      return
    }
    let list = await apiFeedRecordList<IMilkBottle>({
      babyId: appStore.babyInfo.id,
      feedType: EnumFeedType.DIAPER,
      startFeedTime: useDate().subtract(7, 'day').format('YYYY-MM-DD 00:00:00'),
      endFeedTime: useDate().format('YYYY-MM-DD 23:59:59')
    })

    let dateObj = {} as Record<string, any>
    //dateObj 是日期为key, 次数为value的对象
    // 使用连续日期作为可以, 否则会出现间隔
    for (let i = -7; i < 1; i++) {
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

    initDiaperChart(this.data.value)
  }

  /**
   * 初始化尿布图表
   */
  function initDiaperChart(axis: { xAxisData: any[]; yAxisData: any[] }) {
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
    initDiaper,
    initDiaperChart
  }
}
