<script lang="tsx">
import { EnumFeedType } from '@/dict'
// import { useAppStore } from '@/stores'
import { DictItem, useDictList, useRoute } from '@/use'
import { Canvas, Navbar, TabPane, Tabs, Tag } from '@mid-vue/taro-h5-ui'
import Taro from '@tarojs/taro'
import { defineComponent, reactive, ref } from 'vue'
import { useHeightWeightChart } from './hooks/useHeightWeightChart'
// 假设其他 hook 函数也类似拆分，这里先占位
import { useBreastFeedChart } from './hooks/useBreastFeedChart'
import { useDiaperChart } from './hooks/useDiaperChart'
import { useMilkBottleChart } from './hooks/useMilkBottleChart'

export default defineComponent({
  name: 'chart',
  setup() {
    const { query } = useRoute<{ feedType: EnumFeedType }>()
    // let appStore = useAppStore()
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

    const { initHeightWeight } = useHeightWeightChart()
    const { initMilkBottle } = useMilkBottleChart()
    const { initBreastFeed } = useBreastFeedChart()
    const { initDiaper } = useDiaperChart()

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
