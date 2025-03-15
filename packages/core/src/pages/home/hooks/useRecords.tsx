import { useAppStore } from '@/stores'
import { dateFromNow } from '@mid-vue/shared'
import { useCtxState } from '@mid-vue/use'
import { ScrollView } from '@tarojs/components'
import { useDidShow } from '@tarojs/taro'
import { watch } from 'vue'
import { apiGetFeedRecordList } from '../api'
import { type IHomeState } from '../types'
import { useDictMap } from '@/use'
import iconFeedMilk from '@/assets/images/icon_feed_milk.png'
import { Image } from '@mid-vue/taro-h5-ui'

/**  喂养记录 */
export const useRecords = () => {
  const [state, setState] = useCtxState<IHomeState>()

  let appStore = useAppStore()
  watch(
    () => appStore.isLogin,
    (isLogin) => {
      isLogin && init()
    }
  )

  async function init() {
    if (!appStore.isLogin) return

    const res = await apiGetFeedRecordList(state.pagination)
    setState((state) => {
      state.feedRecords = res.list
    })
  }

  useDidShow(() => {
    init()
  })

  let feedTypeMap = useDictMap('FEED_TYPE')
  let milkTypeMap = useDictMap('MILK_TYPE')

  return {
    render: () => (
      <div class='home-records'>
        <div class='home-records-header'>
          <div class='header-title'>喂养记录</div>
          <div class='header-more'>更多</div>
        </div>

        <ScrollView class='home-records-wrapper' scroll-y>
          <div class='home-records-scroll'>
            {state.feedRecords.map((record, index) => {
              let { volume, type } = record.content
              return (
                <div class='home-records-item' key={index}>
                  <div class='records-item-time'>
                    {dateFromNow(record.feedTime, {
                      today: '${h}小时${m}分钟前'
                    })}
                  </div>
                  <div class='home-records-item-wrapper'>
                    <div class='record-item-logo'>
                      <Image src={iconFeedMilk} class='item-logo-img'></Image>
                    </div>
                    <div>
                      <div class='records-item-title'>{milkTypeMap[type]?.name}</div>
                      <div class='records-item-content'>
                        <span>总量: {volume} ml</span>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </ScrollView>
      </div>
    )
  }
}
