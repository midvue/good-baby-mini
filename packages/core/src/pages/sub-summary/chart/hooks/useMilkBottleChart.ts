import { EnumFeedType } from '@/dict'
import { useAppStore } from '@/stores'
import { EnumYesNoPlus, useDate } from '@mid-vue/shared'
import { useCtxState } from '@mid-vue/use'
import { Chart, EnumLineType } from '../../utils/chart'
import { apiFeedRecordList } from '../api' // 假设存在该 API
import { IChartState } from '../types'

export function useMilkBottleChart() {
  let [state] = useCtxState<IChartState>()
  const appStore = useAppStore()

  /**
   * 初始化奶瓶喂养图表数据
   * @param code - 图表类型代码
   */
  async function initMilkBottle() {
    let code = this.childCode.value
    let list = await apiFeedRecordList<IMilkBottle>({
      babyId: appStore.babyInfo.id,
      feedType: EnumFeedType.MILK_BOTTLE,
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
        volume: (axis[feedDate]?.volume || 0) + feedRecord.content.volume
      }
      return axis
    }, dateObj)

    this.data.value = {
      xAxisData: Object.keys(axis),
      yAxisNum: Object.values(axis).map((item) => item.num),
      yAxisVolume: Object.values(axis).map((item) => item.volume)
    }

    initChart(code, this.data.value)
  }

  function initChart(
    code: string | undefined,
    axis: { xAxisData: any[]; yAxisNum: any[]; yAxisVolume: any[] }
  ) {
    let yDatas = code === EnumYesNoPlus.YES ? axis.yAxisNum : axis.yAxisVolume
    // 求平均值
    if (!yDatas.length) return
    let average = (yDatas.reduce((sum, num) => sum + num, 0) / yDatas.length).toFixed(1)
    // 提前计算x轴间隔
    let xDataLength = axis.xAxisData.length
    let xInterval = Math.floor(xDataLength / 7)

    new Chart().init(`${EnumFeedType.MILK_BOTTLE}Canvas`, {
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
          data: yDatas
        },
        {
          name: ' ',
          category: 'line',
          type: EnumLineType.DASHED,
          toolTips: {
            show: (index: number) => {
              return index === yDatas.length - 1
            },
            offset: [-10, 0],
            formatter: () => {
              return `平均：${average}${code === EnumYesNoPlus.YES ? '次' : 'ml'}`
            }
          },
          data: yDatas.map(() => +average)
        },
        {
          name: ' ',
          category: 'line',
          toolTips: {
            show: false
          },
          data: yDatas.map(() => 0)
        }
      ]
    })
  }

  return {
    initMilkBottle
  }
}
