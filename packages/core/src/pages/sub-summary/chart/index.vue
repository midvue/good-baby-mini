<script lang="tsx">
import { DictItem, useDictList, useRoute } from '@/use'
import { Canvas, Navbar, TabPane, Tabs, Tag } from '@mid-vue/taro-h5-ui'
import { defineComponent, onMounted, reactive } from 'vue'
import { init } from '../utils/chart'
import { maleHeight } from './data'
import { EnumFeedType } from '@/dict'
export default defineComponent({
  name: 'chart',
  setup() {
    const { query } = useRoute<{ feedType: EnumFeedType }>()

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

    function initChart() {
      if (state.tabActive !== EnumFeedType.HEIGHT_WEIGHT) return
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
        series: Object.keys(maleHeight).map((key, index) => {
          return {
            name: key,
            category: 'line',
            toolTips: {
              show: key === '六六'
            },
            data: maleHeight[key as keyof typeof maleHeight].slice(0, 12)
          }
        })
      })
    }

    onMounted(() => {
      initChart()
    })

    async function onChangeTab() {
      initChart()
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
              style={{ width: '100%', height: '500px' }}
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
