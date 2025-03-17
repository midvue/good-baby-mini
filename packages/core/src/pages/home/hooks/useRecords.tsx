import { useAppStore } from '@/stores'
import { dateFromNow } from '@mid-vue/shared'
import { useCtxState } from '@mid-vue/use'
import { ScrollView } from '@tarojs/components'
import { useDidShow } from '@tarojs/taro'
import { reactive, watch } from 'vue'
import { apiGetFeedRecordList } from '../api'
import { type IHomeState } from '../types'
import { useDictMap } from '@/use'
import { Image } from '@mid-vue/taro-h5-ui'
import { EnumFeedType } from '@/dict'
import iconFeedMilk from '../assets/icon_feed_milk.png'
import IconFeedDiaper from '../assets/icon_feed_diaper.png'
import iconFeedHeight from '../assets/icon_feed_height.png'

/**  喂养记录 */
export const useRecords = () => {
  const [state, setState] = useCtxState<IHomeState>()

  let appStore = useAppStore()
  let currState = reactive({
    isRefresher: false
  })

  watch(
    () => state.babyInfo.id,
    (id) => {
      id && getRecordList()
    }
  )

  /** 获取喂养记录 */
  async function getRecordList(isRefresh = true) {
    if (!appStore.isLogin || !state.babyInfo.id) return
    if (isRefresh) {
      currState.isRefresher = true
      setState((state) => {
        state.pagination.current = 1
      })
    } else {
      currState.isRefresher = false
      setState((state) => {
        state.loading = true
        state.pagination.current += 1
      })
    }
    const res = await apiGetFeedRecordList({
      babyId: state.babyInfo.id,
      ...state.pagination
    })
    setState((state) => {
      if (isRefresh) {
        state.feedRecords = res.list
      } else {
        state.feedRecords = state.feedRecords.concat(res.list)
      }
    })
  }

  useDidShow(() => {
    getRecordList()
  })

  let milkTypeMap = useDictMap('MILK_TYPE')
  let diaperTypeMap = useDictMap('DIAPER_TYPE')
  let poopTypeMap = useDictMap('POOP_TYPE')

  let onRefresh = async () => {
    await getRecordList()
    currState.isRefresher = false
  }
  let onLoadMore = () => {
    getRecordList(false).finally(() => setState((state) => (state.loading = false)))
  }

  let feedTypeStrategy = {
    /** 奶粉 */
    [EnumFeedType.MILK]: {
      render: (content: IMilk) => {
        let { volume, type } = content
        return (
          <div class='home-records-item-wrapper'>
            <div class='record-item-logo'>
              <Image src={iconFeedMilk} class='item-logo-img'></Image>
            </div>
            <div>
              <div class='records-item-title'>{milkTypeMap[type]?.name}</div>
              <div class='records-item-content'>
                总量:<span class='content-volume'> {volume}</span> ml
              </div>
            </div>
          </div>
        )
      }
    },
    /** 尿布 */
    [EnumFeedType.DIAPER]: {
      render: (content: IDiaper) => {
        let { type, poopType } = content
        return (
          <div class='home-records-item-wrapper'>
            <div class='record-item-logo'>
              <Image src={IconFeedDiaper} class='item-logo-img'></Image>
            </div>
            <div>
              <div class='records-item-title'>{diaperTypeMap[type]?.name}</div>
              <div class='records-item-content'>{poopTypeMap[poopType]?.name}</div>
            </div>
          </div>
        )
      }
    },
    [EnumFeedType.HEIGHT_WEIGHT]: {
      render: (content: IHeightWeight) => {
        let { weight, height } = content
        return (
          <div class='home-records-item-wrapper'>
            <div class='record-item-logo'>
              <Image src={iconFeedHeight} class='item-logo-img'></Image>
            </div>
            <div>
              <div class='records-item-title'>身高: {height} cm</div>
              <div class='records-item-content'>体重: {weight} kg</div>
            </div>
          </div>
        )
      }
    }
  }

  return {
    render: () => (
      <div class='home-records'>
        <div class='home-records-header'>
          <div class='header-title'>喂养记录</div>
          <div class='header-more'>更多</div>
        </div>

        <ScrollView
          class='home-records-wrapper'
          scroll-y
          refresher-enabled
          refresher-triggered={currState.isRefresher}
          onRefresherrefresh={onRefresh}
          onScrolltolower={onLoadMore}
        >
          <div class='home-records-scroll'>
            {state.feedRecords.map((record, index) => {
              let strategy = feedTypeStrategy[record.feedType]
              return (
                <div class={['home-records-item', 'records-item-' + record.feedType]} key={index}>
                  <div class='records-item-time'>
                    {dateFromNow(record.feedTime, {
                      today: '${h}小时${m}分钟前'
                    })}
                  </div>
                  {strategy.render(record.content)}
                </div>
              )
            })}
          </div>
        </ScrollView>
      </div>
    )
  }
}
