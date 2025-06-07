import { EnumFeedType } from '@/dict'
import { useAppStore } from '@/stores'
import { EnumYesNoPlus, useDate } from '@mid-vue/shared'
import { Chart, EnumLineType, init } from '../../utils/chart'
import { apiFeedRecordList } from '../api'
import {
  femaleHeadCircumference,
  femaleHeight,
  femaleWeight,
  maleHeadCircumference,
  maleHeight,
  maleWeight
} from '../data'
// 引入新生成的枚举
import { EnumHeightWeightIndex } from '../dict'

export function useHeightWeightChart() {
  const appStore = useAppStore()

  /**
   * 初始化身高体重图表数据
   * @param code - 图表类型代码，默认为 '10'，用于区分显示身高或体重数据
   */
  async function initHeightWeight() {
    // 检查数据是否已存在，如果存在则直接初始化图表
    //this 指向调用者 strategy 实例

    let code = this.childCode.value
    if (this.data.value) {
      initChart(code, this.data.value)
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
        axis.headCircumferenceArr[month] = Number(feedRecord.content.headCircumference || 0)
        axis.footLengthArr[month] = Number(feedRecord.content.footLength || 0)
        return axis
      },
      {
        // 初始化身高数组，长度为当前月龄加 1，初始值为 undefined
        heightArr: new Array(currMonth + 1).fill(undefined),
        weightArr: new Array(currMonth + 1).fill(undefined),
        headCircumferenceArr: new Array(currMonth + 1).fill(undefined),
        footLengthArr: new Array(currMonth + 1).fill(undefined)
      }
    )

    initChart(code, this.data.value)
  }

  function initChart(
    code: string,
    axis: { heightArr: any[]; weightArr: any[]; headCircumferenceArr: any[]; footLengthArr: any[] }
  ) {
    let isFemale = appStore.babyInfo.gender === EnumYesNoPlus.YES
    let heightData = isFemale ? femaleHeight : maleHeight
    let weightData = isFemale ? femaleWeight : maleWeight
    let headCircumferenceData = isFemale ? femaleHeadCircumference : maleHeadCircumference
    type Serieskey = keyof typeof heightData
    let seriesData = {} as Record<Serieskey, number[]>
    let yData = [] as number[]

    switch (code) {
      case EnumHeightWeightIndex.HEIGHT:
        seriesData = heightData
        yData = axis.heightArr
        break
      case EnumHeightWeightIndex.WEIGHT:
        seriesData = weightData
        yData = axis.weightArr
        break
      case EnumHeightWeightIndex.HEAD_CIRCUMFERENCE:
        seriesData = headCircumferenceData
        yData = axis.headCircumferenceArr
        break
      case EnumHeightWeightIndex.FOOT_LENGTH:
        {
          seriesData = {} as Record<Serieskey, number[]>
          yData = axis.footLengthArr
        }
        break
      default: {
        seriesData = {} as Record<Serieskey, number[]>
        yData = []
      }
    }

    new Chart().init(`${EnumFeedType.HEIGHT_WEIGHT}Canvas`, {
      hideYAxis: false,
      colors: [
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
          data: yData
        }
      ]
    })
  }

  return {
    initHeightWeight
  }
}
