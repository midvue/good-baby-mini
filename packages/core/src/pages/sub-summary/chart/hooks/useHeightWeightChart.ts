import { useAppStore } from '@/stores'
import { apiFeedRecordList } from '../api'
import { useDate, EnumYesNoPlus } from '@mid-vue/shared'
import { EnumFeedType } from '@/dict'
import { EnumLineType, init } from '../../utils/chart'
import { femaleHeight, femaleWeight, maleHeight, maleWeight } from '../data'

export function useHeightWeightChart() {
  const appStore = useAppStore()

  /**
   * 初始化身高体重图表数据
   * @param code - 图表类型代码，默认为 '10'，用于区分显示身高或体重数据
   */
  async function initHeightWeight(code = '10') {
    // 检查数据是否已存在，如果存在则直接初始化图表
    if (this.data.value) {
      initHeightWeightChart(code, this.data.value)
      return
    }
    let list = await apiFeedRecordList<IHeightWeight>({
      babyId: appStore.babyInfo.id,
      feedType: EnumFeedType.HEIGHT_WEIGHT
    })
    // 获取宝宝的出生日期
    let { birthDate } = appStore.babyInfo
    let now = useDate()
    // 将宝宝出生日期转换为日期对象
    let targetDate = useDate(birthDate)
    // 计算从宝宝出生到现在的月龄
    const currMonth = now.diff(targetDate, 'month')
    // 使用 reduce 方法处理 API 返回的数据，将身高和体重数据按月龄整理到数组中
    this.data.value = list.reduce(
      (axis, feedRecord) => {
        let feedDate = useDate(feedRecord.feedTime)
        let targetDate = useDate(birthDate)
        // 计算月龄
        let month = feedDate.diff(targetDate, 'month')
        // 计算宝宝出生后第 month 个月的对应日期
        let sameMonthTargetDate = useDate(birthDate).add(month, 'month')
        // 计算喂养记录日期和宝宝出生后第 month 个月对应日期相差的天数
        let diffDays = feedDate.diff(sameMonthTargetDate, 'day')
        // 如果相差天数大于 15 天，则月龄加 1
        if (diffDays > 15) {
          month += 1
        }

        // 将该月龄对应的身高数据存入 heightArr 数组
        axis.heightArr[month] = +feedRecord.content.height
        axis.weightArr[month] = +feedRecord.content.weight
        return axis
      },
      {
        // 初始化身高数组，长度为当前月龄加 1，初始值为 undefined
        heightArr: new Array(currMonth + 1).fill(undefined),
        weightArr: new Array(currMonth + 1).fill(undefined)
      }
    )

    initHeightWeightChart(code, this.data.value)
  }

  function initHeightWeightChart(code: string, axis: { heightArr: any[]; weightArr: any[] }) {
    let heightData = appStore.babyInfo.gender === EnumYesNoPlus.YES ? femaleHeight : maleHeight
    let WeightData = appStore.babyInfo.gender === EnumYesNoPlus.YES ? femaleWeight : maleWeight
    let seriesData = code === '10' ? heightData : WeightData

    init(`${EnumFeedType.HEIGHT_WEIGHT}Canvas`, {
      hideYAxis: false,
      color: [
        '#ED7672',
        '#F3AA59',
        '#74DAE5',
        '#1aad19',
        '#74DAE5',
        '#F3AA59',
        '#ED7672',
        '#180d41'
      ],
      title: {
        text: '',
        color: '#333333',
        size: 15
      },
      xAxis: {
        color: '#666A73',
        size: 10,
        data: [
          '0',
          '1',
          '2',
          '3',
          '4',
          '5',
          '6',
          '7',
          '8',
          '9',
          '10',
          '11',
          '1岁',
          '13',
          '14',
          '15',
          '16',
          '17',
          '18',
          '19',
          '20',
          '21',
          '22',
          '23',
          '2岁'
        ]
      },
      series: [
        ...Object.keys(seriesData).map((key) => {
          return {
            name: key,
            category: 'line',
            type: EnumLineType.DASHED,
            toolTips: {
              show: (index: number) => {
                return index >= 12
              },
              offset: [13, 12],
              formatter: () => {
                return key
              }
            },
            data: seriesData[key as keyof typeof seriesData].slice(0, 13)
          }
        }),
        {
          name: appStore.babyInfo.nickname,
          category: 'line',
          toolTips: {
            show: true
          },
          data: code === '10' ? axis.heightArr : axis.weightArr
        }
      ]
    })
  }

  return {
    initHeightWeight,
    initHeightWeightChart
  }
}
