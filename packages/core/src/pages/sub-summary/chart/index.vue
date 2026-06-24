<script lang="tsx">
import { defineComponent, onUnmounted, reactive, ref } from 'vue'
import Taro from '@tarojs/taro'
import { ScrollView } from '@tarojs/components'
import { EnumYesNoPlus, useDate } from '@allkit/shared'
import { Canvas, Navbar, Picker, TabPane, Tabs, Tag, Icon } from '@allkit/taro-h5-ui'
import { defineCtxState } from '@allkit/use'
import { EnumFeedType } from '@/dict'
import { type DictItem, useDictList, useRoute } from '@/use'
import { useBreastFeedChart } from './hooks/useBreastFeedChart'
import { useDiaperChart } from './hooks/useDiaperChart'
import { useHeightWeightChart } from './hooks/useHeightWeightChart'
import { useMilkBottleChart } from './hooks/useMilkBottleChart'
import { type IChartState } from './types'

export default defineComponent({
  name: 'Chart',
  setup() {
    const { query } = useRoute<{ feedType: EnumFeedType }>()
    // 鏂板閫変腑鐘舵€?
    const selectedDateRange = ref<number>(7)

    const [state] = defineCtxState<IChartState>({
      tabActive: (+query.feedType || 40) as EnumFeedType,
      form: {
        startFeedTime: useDate().subtract(7, 'day').format('YYYY-MM-DD'),
        endFeedTime: useDate().format('YYYY-MM-DD')
      }
    })

    const initTabList = () => {
      const feedTypeList = useDictList('FEED_TYPE')
      const slicedFeedTypeList = feedTypeList.slice(0, 4)
      return slicedFeedTypeList
        .filter((feedType) => !!feedType.ext)
        .map((feedType) => {
          const { ext, ...rest } = feedType
          const obj = reactive(rest) as DictItem & {
            sort: number
            childIndex: number
            children: { label: string; code: string }[]
          }
          const extObj = JSON.parse(ext!)
          obj.childIndex = 0
          obj.sort = extObj.summary.sort
          obj.children = extObj.summary.children
          return obj
        })
        .sort((a, b) => {
          return a.sort - b.sort
        })
    }
    const tabList = initTabList()

    const { initHeightWeight } = useHeightWeightChart()
    const { initMilkBottle } = useMilkBottleChart()
    const { initBreastFeed } = useBreastFeedChart()
    const { initDiaper } = useDiaperChart()
    const systemInfo = Taro.getSystemInfoSync()
    const heightWeightYAxisWidth = ref(34)
    const heightWeightChartContentWidth = ref(systemInfo.windowWidth)
    const heightWeightChartHeight = ref(systemInfo.windowWidth * 1.3)
    const heightWeightCurrMonth = ref(0)
    const milkBottleYAxisWidth = ref(44)
    const milkBottleChartContentWidth = ref(systemInfo.windowWidth)
    const breastFeedYAxisWidth = ref(44)
    const breastFeedChartContentWidth = ref(systemInfo.windowWidth)
    const diaperYAxisWidth = ref(44)
    const diaperChartContentWidth = ref(systemInfo.windowWidth)
    let chartInitTimer: ReturnType<typeof setTimeout> | undefined

    const feedTypeStrategy = {
      [EnumFeedType.HEIGHT_WEIGHT]: {
        data: ref(),
        childCode: ref<string>(EnumYesNoPlus.YES),
        chartYAxisWidth: heightWeightYAxisWidth,
        chartContentWidth: heightWeightChartContentWidth,
        chartHeight: heightWeightChartHeight,
        currMonth: heightWeightCurrMonth,
        init: initHeightWeight,
        render: () => renderChartCanvas(EnumFeedType.HEIGHT_WEIGHT)
      },
      [EnumFeedType.MILK_BOTTLE]: {
        data: ref(),
        childCode: ref(EnumYesNoPlus.YES),
        chartYAxisWidth: milkBottleYAxisWidth,
        chartContentWidth: milkBottleChartContentWidth,
        init: initMilkBottle,
        render: () => renderChartCanvas(EnumFeedType.MILK_BOTTLE)
      },
      [EnumFeedType.BREAST_FEED_DIRECT]: {
        data: ref(),
        childCode: ref(EnumYesNoPlus.YES),
        chartYAxisWidth: breastFeedYAxisWidth,
        chartContentWidth: breastFeedChartContentWidth,
        init: initBreastFeed,
        render: () => renderChartCanvas(EnumFeedType.BREAST_FEED_DIRECT)
      },
      [EnumFeedType.DIAPER]: {
        data: ref(),
        childCode: ref(EnumYesNoPlus.YES),
        chartYAxisWidth: diaperYAxisWidth,
        chartContentWidth: diaperChartContentWidth,
        // 淇敼 init 鍑芥暟锛屼紶閫掓棩鏈熷弬鏁?
        init: initDiaper,
        render: () => renderChartCanvas(EnumFeedType.DIAPER)
      }
    } as const

    function initChart() {
      if (chartInitTimer) {
        clearTimeout(chartInitTimer)
      }
      chartInitTimer = setTimeout(() => {
        const strategy = feedTypeStrategy[state.tabActive] || {}
        strategy.init?.()
        chartInitTimer = undefined
      }, 32)
    }
    initChart()

    const handleTopTabChange = () => {
      initChart()
    }

    onUnmounted(() => {
      if (chartInitTimer) {
        clearTimeout(chartInitTimer)
      }
    })

    /**
     *  鐩戝惉鏃ユ湡閫夋嫨鐨勫彉鍖栵紝閲嶆柊娓叉煋鍥捐〃
     */
    const onDateChange = (type: EnumYesNoPlus) => {
      // 璧峰鍜岀粨鏉熸棩鏈熶笉鑳界浉宸?0澶╀互涓? 瓒呰繃30澶╁氨鑷姩鍒囨崲鍒?0澶?
      // 濡傛灉鏀瑰彉鐨勬槸璧峰鏃ユ湡锛岀粨鏉熸棩鏈熷氨鑷姩鍙樻垚璧峰鏃ユ湡鐨勫悗
      const diffDate = useDate(state.form.endFeedTime).diff(
        useDate(state.form.startFeedTime),
        'day'
      )
      if (diffDate > 30 || diffDate < 0) {
        Taro.showToast({ title: '日期最多只能选择30天哦!', icon: 'none' })
        if (type === EnumYesNoPlus.YES) {
          state.form.endFeedTime = useDate(state.form.startFeedTime)
            .add(30, 'day')
            .format('YYYY-MM-DD')
        } else {
          state.form.startFeedTime = useDate(state.form.endFeedTime)
            .subtract(30, 'day')
            .format('YYYY-MM-DD')
        }
      }
      selectedDateRange.value = 0
      initChart()
    }

    // 鏂板鏃ユ湡鑼冨洿閫夋嫨澶勭悊鍑芥暟
    const handleDateRangeSelect = (range: number) => {
      selectedDateRange.value = range
      state.form.startFeedTime = useDate().subtract(range, 'day').format('YYYY-MM-DD')
      state.form.endFeedTime = useDate().format('YYYY-MM-DD')
      initChart()
    }

    /** 娓叉煋閫夋嫨鏃ユ湡鐨勭粍浠?*/
    const renderChooseDate = (feedType: EnumFeedType) => {
      if (feedType === EnumFeedType.HEIGHT_WEIGHT) return null
      return (
        <div class='date-choose'>
          <div class='date-left'>
            <div class='date-text'>日期范围</div>
            <div class='picker'>
              <Picker
                v-model={state.form.startFeedTime}
                mode='date'
                end={useDate().format('YYYY-MM-DD')}
                onChange={() => onDateChange(EnumYesNoPlus.YES)}
              >
                {useDate(state.form.startFeedTime).format('MM-DD')}
              </Picker>
              <Icon name='down'></Icon>
            </div>

            <div class='date-text'>到</div>
            <div class='picker'>
              <Picker
                v-model={state.form.endFeedTime}
                mode='date'
                end={useDate().format('YYYY-MM-DD')}
                onChange={() => onDateChange(EnumYesNoPlus.NO)}
              >
                {useDate(state.form.endFeedTime).format('MM-DD')}
              </Picker>
              <Icon name='down'></Icon>
            </div>
          </div>
          <div class='date-right'>
            <div
              class={`right-item ${selectedDateRange.value === 7 ? 'selected' : ''}`}
              onClick={() => handleDateRangeSelect(7)}
            >
              近7天
            </div>
            <div
              class={`right-item ${selectedDateRange.value === 30 ? 'selected' : ''}`}
              onClick={() => handleDateRangeSelect(30)}
            >
              近30天
            </div>
          </div>
        </div>
      )
    }

    function renderChartCanvas(feedType: EnumFeedType) {
      if (feedType === EnumFeedType.HEIGHT_WEIGHT) {
        return (
          <div class='chart-canvas-area'>
            <div class='chart-canvas-shell'>
              <div
                class='chart-y-axis-canvas'
                style={{
                  width: `${heightWeightYAxisWidth.value}px`,
                  minWidth: `${heightWeightYAxisWidth.value}px`,
                  flexBasis: `${heightWeightYAxisWidth.value}px`
                }}
              >
                <Canvas
                  key={feedType + 'YAxisCanvas'}
                  canvas-id={feedType + 'YAxisCanvas'}
                  catchMove={false}
                  style={{ width: '100%', height: '100%' }}
                ></Canvas>
              </div>
              <ScrollView
                class='chart-canvas-viewport'
                scrollX
                scrollY={false}
                enhanced
                showScrollbar={false}
              >
                <div
                  class='chart-canvas-content'
                  style={{
                    width: `${heightWeightChartContentWidth.value}px`,
                    height: `${heightWeightChartHeight.value}px`
                  }}
                >
                  <Canvas
                    key={feedType + 'ContentCanvas'}
                    canvas-id={feedType + 'ContentCanvas'}
                    catchMove={false}
                    style={{ width: '100%', height: '100%' }}
                  ></Canvas>
                </div>
              </ScrollView>
            </div>
          </div>
        )
      }

      const strategy = feedTypeStrategy[feedType]
      const yAxisWidth = strategy.chartYAxisWidth?.value || 44
      const chartContentWidth = strategy.chartContentWidth?.value || systemInfo.windowWidth
      return (
        <div class='chart-normal-canvas-shell'>
          <div
            class='chart-normal-y-axis-canvas'
            style={{
              width: `${yAxisWidth}px`,
              minWidth: `${yAxisWidth}px`,
              flexBasis: `${yAxisWidth}px`
            }}
          >
            <Canvas
              key={feedType + 'YAxisCanvas'}
              canvas-id={feedType + 'YAxisCanvas'}
              style={{ width: '100%', height: '100%' }}
            ></Canvas>
          </div>
          <ScrollView
            class='chart-normal-canvas-viewport'
            scrollX
            scrollY={false}
            enhanced
            showScrollbar={false}
          >
            <div
              class='chart-normal-canvas-content'
              style={{
                width: `${chartContentWidth}px`
              }}
            >
              <Canvas
                key={feedType + 'ContentCanvas'}
                canvas-id={feedType + 'ContentCanvas'}
                style={{ width: '100%', height: '100%' }}
              ></Canvas>
            </div>
          </ScrollView>
        </div>
      )
    }

    return () => {
      const strategy = feedTypeStrategy[state.tabActive] || {}

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
            <Tabs v-model={state.tabActive} onChange={handleTopTabChange} border={false}>
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
                              strategy.childCode.value = tag.code
                              strategy.init?.()
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
