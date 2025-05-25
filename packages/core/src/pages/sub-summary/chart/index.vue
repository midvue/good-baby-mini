<script lang="tsx">
import { EnumFeedType } from '@/dict'
import { useAppStore } from '@/stores'
import { DictItem, useDictList, useRoute } from '@/use'
import { EnumYesNoPlus, useDate } from '@mid-vue/shared'
import { Canvas, Navbar, TabPane, Tabs, Tag } from '@mid-vue/taro-h5-ui'
import Taro from '@tarojs/taro'
import { defineComponent, reactive, ref } from 'vue'
import { init } from '../utils/chart'
import { apiFeedRecordList } from './api'
import { femaleHeight, femaleWeight, maleHeight, maleWeight } from './data'
export default defineComponent({
  name: 'chart',
  setup() {
    const { query } = useRoute<{ feedType: EnumFeedType }>()
    let appStore = useAppStore()
    const state = reactive({
      tabActive: (+query.feedType || 40) as EnumFeedType,
      form: {}
    })

    let initTabList = () => {
      let feedTypeList = useDictList('FEED_TYPE')
      return feedTypeList
        .filter((feedType) => !!feedType.ext)
        .map((feedType) => {
          let { ext, ...rest } = feedType
          let obj = reactive(rest) as DictItem & {
            sort: number
            childIndex: number
            children: { label: string; code: string }[]
          }
          let extObj = JSON.parse(ext!)
          obj.childIndex = 0
          obj.sort = extObj.summary.sort
          obj.children = extObj.summary.children
          return obj
        })
        .sort((a, b) => {
          return a.sort - b.sort
        })
    }
    let tabList = initTabList()

    async function initMilkBottle(code = '10') {
      if (this.data.value) {
        initMilkBottleChart(code, this.data.value)
        return
      }
      let list = await apiFeedRecordList<IMilkBottle>({
        babyId: appStore.babyInfo.id,
        feedType: EnumFeedType.MILK_BOTTLE,
        startFeedTime: useDate().subtract(7, 'day').format('YYYY-MM-DD 00:00:00'),
        endFeedTime: useDate().format('YYYY-MM-DD 23:59:59')
      })

      let dateObj = {} as Record<string, any>
      //dateObj 是日期为key, 次数为value的对象
      // 使用连续日期作为可以, 否则会出现间隔
      for (let i = -7; i < 1; i++) {
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
      code: string,
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
            toolTips: {
              show: (index: number) => {
                return index === yData.length - 1
              },
              offset: [-10, 0],
              formatter: () => {
                return `平均：${average}${code === EnumYesNoPlus.YES ? '次' : 'ml'}`
              }
            },
            data: yData.map(() => average)
          }
        ]
      })
    }

    async function initBreastFeed(code = '10') {
      if (this.data.value) {
        initBreastFeedChart(code, this.data.value)
        return
      }
      let list = await apiFeedRecordList<IBreastMilk>({
        babyId: appStore.babyInfo.id,
        feedType: EnumFeedType.BREAST_FEED_DIRECT,
        startFeedTime: useDate().subtract(7, 'day').format('YYYY-MM-DD 00:00:00'),
        endFeedTime: useDate().format('YYYY-MM-DD 23:59:59')
      })
      let axis = list.reduce(
        (axis, feedRecord) => {
          let feedDate = useDate(feedRecord.feedTime).format('MM-DD')
          axis[feedDate] = {
            num: (axis[feedDate]?.num || 0) + 1,
            volume: (axis[feedDate]?.volume || 0) + feedRecord.content.duration
          }
          return axis
        },
        {} as Record<string, any>
      )

      this.data.value = {
        xAxisData: Object.keys(axis),
        yAxisNum: Object.values(axis).map((item) => item.num),
        yAxisVolume: Object.values(axis).map((item) => item.volume)
      }

      initBreastFeedChart(code, this.data.value)
    }

    function initBreastFeedChart(
      code: string,
      axis: { xAxisData: any[]; yAxisNum: any[]; yAxisVolume: any[] }
    ) {
      let yData = code === '10' ? axis.yAxisNum : axis.yAxisVolume
      init(`${EnumFeedType.BREAST_FEED_DIRECT}Canvas`, {
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
          }
        ]
      })
    }

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
            toolTips: {
              show: (index: number) => {
                return index === axis.yAxisData.length - 1
              },
              formatter: () => {
                return `平均：${average}次`
              }
            },
            data: axis.yAxisData.map(() => average)
          }
        ]
      })
    }

    async function initHeightWeight(code = '10') {
      if (this.data.value) {
        initHeightWeightChart(code, this.data.value)
        return
      }
      let list = await apiFeedRecordList<IHeightWeight>({
        babyId: appStore.babyInfo.id,
        feedType: EnumFeedType.HEIGHT_WEIGHT
      })
      let { birthDate } = appStore.babyInfo
      let now = useDate()
      let targetDate = useDate(birthDate)
      const currMonth = now.diff(targetDate, 'month')
      this.data.value = list.reduce(
        (axis, feedRecord) => {
          let feedDate = useDate(feedRecord.feedTime)
          let targetDate = useDate(birthDate)
          const month = feedDate.diff(targetDate, 'month')

          axis.heightArr[month] = +feedRecord.content.height
          axis.weightArr[month] = +feedRecord.content.weight
          return axis
        },
        {
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

    let feedTypeStrategy = {
      [EnumFeedType.HEIGHT_WEIGHT]: {
        data: ref(),
        init: initHeightWeight,
        render: function () {
          return (
            <Canvas
              key={EnumFeedType.HEIGHT_WEIGHT + 'Canvas'}
              canvas-id={EnumFeedType.HEIGHT_WEIGHT + 'Canvas'}
              style={{ width: '100%', height: '100%', flex: 1 }}
            ></Canvas>
          )
        }
      },
      [EnumFeedType.MILK_BOTTLE]: {
        data: ref(),
        init: initMilkBottle,
        render: () => {
          return (
            <Canvas
              key={EnumFeedType.MILK_BOTTLE + 'Canvas'}
              canvas-id={EnumFeedType.MILK_BOTTLE + 'Canvas'}
              style={{ width: '100%', height: '100%', flex: 1 }}
            ></Canvas>
          )
        }
      },
      [EnumFeedType.BREAST_FEED_DIRECT]: {
        data: ref(),
        init: initBreastFeed,
        render: () => {
          return (
            <Canvas
              key={EnumFeedType.BREAST_FEED_DIRECT + 'Canvas'}
              canvas-id={EnumFeedType.BREAST_FEED_DIRECT + 'Canvas'}
              style={{ width: '100%', height: '100%', flex: 1 }}
            ></Canvas>
          )
        }
      },
      [EnumFeedType.DIAPER]: {
        data: ref(),
        init: initDiaper,
        render: () => {
          return (
            <Canvas
              key={EnumFeedType.DIAPER + 'Canvas'}
              canvas-id={EnumFeedType.DIAPER + 'Canvas'}
              style={{ width: '100%', height: '100%', flex: 1 }}
            ></Canvas>
          )
        }
      }
    } as const
    let strategy = feedTypeStrategy[state.tabActive] || {}
    Taro.nextTick(() => {
      strategy.init?.()
    })
    return () => {
      let strategy = feedTypeStrategy[state.tabActive] || {}

      return (
        <div class='chart'>
          <Navbar
            title='图表'
            defaultConfig={{
              frontColor: '#000000',
              backgroundColor: 'fff8e5'
            }}
          ></Navbar>
          <div class='chart-tabs'>
            <Tabs
              v-model={state.tabActive}
              onChange={() => {
                setTimeout(() => {
                  strategy = feedTypeStrategy[state.tabActive] || {}
                  strategy.init?.()
                }, 50)
              }}
              border={false}
            >
              {tabList.map((feedType) => {
                return (
                  <TabPane label={feedType.name} key={feedType.code} name={+feedType.code}>
                    <div class='tabs-pane-switch'>
                      {feedType.children.map((tag, index) => {
                        return (
                          <Tag
                            size='large'
                            class='switch-tag'
                            round
                            type={feedType.childIndex === index ? 'primary' : 'default'}
                            plain={feedType.childIndex !== index}
                            key={tag.code + '_' + index}
                            onClick={() => {
                              feedType.childIndex = index
                              strategy.init?.(tag.code)
                            }}
                          >
                            {tag.label}
                          </Tag>
                        )
                      })}
                    </div>
                  </TabPane>
                )
              })}
            </Tabs>
          </div>

          {strategy.render?.()}
        </div>
      )
    }
  }
})
</script>
<style lang="scss">
@import './index.scss';
</style>
