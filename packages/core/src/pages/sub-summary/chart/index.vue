<script lang="tsx">
import { DictItem, useDictList, useRoute } from '@/use'
import { Canvas, Navbar, TabPane, Tabs, Tag } from '@mid-vue/taro-h5-ui'
import { defineComponent, onMounted, reactive } from 'vue'
import { init } from '../utils/chart'
import { femaleHeight, femaleWeight, maleHeight, maleWeight } from './data'
import { EnumFeedType } from '@/dict'
import { apiFeedRecordList } from './api'
import { EnumYesNo, EnumYesNoPlus, useDate } from '@mid-vue/shared'
import { useAppStore } from '@/stores'
export default defineComponent({
  name: 'chart',
  setup() {
    const { query } = useRoute<{ feedType: EnumFeedType }>()
    let appStore = useAppStore()
    const state = reactive({
      tabActive: +query.feedType || 40,
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

    let axis: { heightArr: any[]; weightArr: any[]; xArr: [] }
    async function initHeightWeight() {
      if (state.tabActive !== EnumFeedType.HEIGHT_WEIGHT) return
      let list = await apiFeedRecordList<IHeightWeight>({
        babyId: appStore.babyInfo.id,
        feedType: EnumFeedType.HEIGHT_WEIGHT
      })
      let { birthDate } = appStore.babyInfo
      let now = useDate()
      let targetDate = useDate(birthDate)
      const currMonth = now.diff(targetDate, 'month')
      axis = list.reduce(
        (axis, feedRecord) => {
          let feedDate = useDate(feedRecord.feedTime)
          let targetDate = useDate(birthDate)
          const month = feedDate.diff(targetDate, 'month')

          axis.heightArr[month] = +feedRecord.content.height
          axis.weightArr[month] = +feedRecord.content.weight
          return axis
        },
        {
          xArr: [],
          heightArr: new Array(currMonth + 1).fill(undefined),
          weightArr: new Array(currMonth + 1).fill(undefined)
        }
      )

      initChart()
    }

    function initChart(code = '10') {
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
                show: false
              },
              data: seriesData[key as keyof typeof seriesData].slice(0, 12)
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

    onMounted(() => {
      initHeightWeight()
    })

    async function onChangeTab() {
      initHeightWeight()
    }

    return () => {
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
            <Tabs v-model={state.tabActive} onChange={onChangeTab} border={false}>
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
                              if (state.tabActive === EnumFeedType.HEIGHT_WEIGHT) {
                                initChart(tag.code)
                              }
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

          {state.tabActive === EnumFeedType.HEIGHT_WEIGHT && (
            <Canvas
              canvas-id={EnumFeedType.HEIGHT_WEIGHT + 'Canvas'}
              style={{ width: '100%', height: '100%', flex: 1 }}
            />
          )}
        </div>
      )
    }
  }
})
</script>
<style lang="scss">
@import './index.scss';
</style>
