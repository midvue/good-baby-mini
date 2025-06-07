import { useAppStore } from '@/stores'
import { apiFeedRecordList } from '../api' // 假设存在该 API
import { EnumYesNoPlus, useDate } from '@mid-vue/shared'
import { EnumFeedType } from '@/dict'
import { EnumLineType, init } from '../../utils/chart'
import { useCtxState } from '@mid-vue/use'
import { IChartState } from '../types'

export function useMilkBottleChart() {
  let [state] = useCtxState<IChartState>()
  const appStore = useAppStore()

  /**
   * 初始化奶瓶喂养图表数据
   * @param code - 图表类型代码
   */
  async function initMilkBottle(code = EnumYesNoPlus.YES) {
    let list = await apiFeedRecordList<IMilkBottle>({
      babyId: appStore.babyInfo.id,
      feedType: EnumFeedType.MILK_BOTTLE,
      startFeedTime: state.form.startFeedTime + ' 00:00:00',
      endFeedTime: state.form.endFeedTime + ' 23:59:59'
    })

    let dateObj = {} as Record<string, any>
    //dateObj 是日期为key, 次数为value的对象
    // 使用连续日期作为可以, 否则会出现间隔
    let totalDays = useDate(state.form.endFeedTime).diff(useDate(state.form.startFeedTime), 'days')
    for (let i = -totalDays; i < 1; i++) {
      let date = useDate().add(i, 'day').format('MM-DD')
      dateObj[date] = {
        num: 0,
        volume: 0
      }
    }

    let axis = list.reduce((axis, feedRecord) => {
      let feedDate = useDate(feedRecord.feedTime).format('MM-DD')
      axis[feedDate] = {
        num: (axis[feedDate]?.num || 0) + 1,
        volume: (axis[feedDate]?.volume || 0) + feedRecord.content.volume
      }
      return axis
    }, dateObj)

    this.data.value = {
      xAxisData: Object.keys(axis),
      yAxisNum: Object.values(axis).map((item) => item.num),
      yAxisVolume: Object.values(axis).map((item) => item.volume)
    }

    initMilkBottleChart(code, this.data.value)
  }

  function initMilkBottleChart(
    code: string | undefined,
    axis: { xAxisData: any[]; yAxisNum: any[]; yAxisVolume: any[] }
  ) {
    let yData = code === EnumYesNoPlus.YES ? axis.yAxisNum : axis.yAxisVolume

    // 求平均值
    if (!yData.length) return
    let average = (yData.reduce((sum, num) => sum + num, 0) / yData.length).toFixed(1)

    init(`${EnumFeedType.MILK_BOTTLE}Canvas`, {
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
          toolTips: {
            show: false
          },
          data: yData.map(() => 0)
        },
        {
          name: appStore.babyInfo.nickname,
          category: 'line',
          toolTips: {
            show: true
          },
          data: yData
        },
        {
          name: ' ',
          category: 'line',
          type: EnumLineType.DASHED,
          toolTips: {
            show: (index: number) => {
              return index === yData.length - 1
            },
            offset: [-10, 0],
            formatter: () => {
              return `平均：${average}${code === EnumYesNoPlus.YES ? '次' : 'ml'}`
            }
          },
          data: yData.map(() => +average)
        }
      ]
    })
  }

  return {
    initMilkBottle,
    initMilkBottleChart
  }
}
