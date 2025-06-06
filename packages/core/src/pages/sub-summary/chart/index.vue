<script lang="tsx">
import { EnumFeedType } from '@/dict'
import { DictItem, useDictList, useRoute } from '@/use'
import { Canvas, Navbar, Picker, TabPane, Tabs, Tag } from '@mid-vue/taro-h5-ui'
import Taro from '@tarojs/taro'
import { defineComponent, reactive, ref, watch } from 'vue'
import { useHeightWeightChart } from './hooks/useHeightWeightChart'
import { useBreastFeedChart } from './hooks/useBreastFeedChart'
import { useDiaperChart } from './hooks/useDiaperChart'
import { useMilkBottleChart } from './hooks/useMilkBottleChart'
import { sleep, useDate } from '@mid-vue/shared'
import { defineCtxState } from '@mid-vue/use'
import { IChartState } from './types'

export default defineComponent({
  name: 'chart',
  setup() {
    const { query } = useRoute<{ feedType: EnumFeedType }>()

    const [state, setState] = defineCtxState<IChartState>({
      tabActive: (+query.feedType || 40) as EnumFeedType,
      form: {
        startFeedTime: useDate().subtract(7, 'day').format('YYYY-MM-DD'),
        endFeedTime: useDate().format('YYYY-MM-DD')
      }
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

    const { initHeightWeight } = useHeightWeightChart()
    const { initMilkBottle } = useMilkBottleChart()
    const { initBreastFeed } = useBreastFeedChart()
    const { initDiaper } = useDiaperChart()

    const renderChartCanvas = (feedType: EnumFeedType) => {
      return (
        <Canvas
          key={feedType + 'Canvas'}
          canvas-id={feedType + 'Canvas'}
          style={{ width: '100%', height: '100%', flex: 1 }}
        ></Canvas>
      )
    }

    let feedTypeStrategy = {
      [EnumFeedType.HEIGHT_WEIGHT]: {
        data: ref(),
        init: initHeightWeight,
        render: () => renderChartCanvas(EnumFeedType.HEIGHT_WEIGHT)
      },
      [EnumFeedType.MILK_BOTTLE]: {
        data: ref(),
        init: initMilkBottle,
        render: () => renderChartCanvas(EnumFeedType.MILK_BOTTLE)
      },
      [EnumFeedType.BREAST_FEED_DIRECT]: {
        data: ref(),
        init: initBreastFeed,
        render: () => renderChartCanvas(EnumFeedType.BREAST_FEED_DIRECT)
      },
      [EnumFeedType.DIAPER]: {
        data: ref(),
        // 修改 init 函数，传递日期参数
        init: initDiaper,
        render: () => renderChartCanvas(EnumFeedType.DIAPER)
      }
    } as const

    function initChart() {
      sleep(50).then(() => {
        let strategy = feedTypeStrategy[state.tabActive] || {}
        strategy.init?.()
      })
    }
    initChart()

    /**
     *  监听日期选择的变化，重新渲染图表
     */
    const onDateChange = () => {
      initChart()
    }

    /** 渲染选择日期的组件 */
    const renderChooseDate = (feedType: EnumFeedType) => {
      if (feedType === EnumFeedType.HEIGHT_WEIGHT) return null
      return (
        <div class='date-choose'>
          <div class='date-text'>日期范围</div>
          <Picker
            class='picker'
            v-model={state.form.startFeedTime}
            mode='date'
            end={useDate().format('YYYY-MM-DD')}
            onChange={onDateChange}
          ></Picker>
          <div class='date-text'>到</div>
          <Picker
            class='picker'
            v-model={state.form.endFeedTime}
            mode='date'
            end={useDate().format('YYYY-MM-DD')}
            onChange={onDateChange}
          ></Picker>
        </div>
      )
    }
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
            <Tabs v-model={state.tabActive} onChange={() => initChart()} border={false}>
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
          {renderChooseDate(state.tabActive)}
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
