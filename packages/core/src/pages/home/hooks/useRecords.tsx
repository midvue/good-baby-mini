import { useAppStore } from '@/stores'
import { dateFromNow } from '@mid-vue/shared'
import { useCtxState } from '@mid-vue/use'
import { ScrollView } from '@tarojs/components'
import { useDidShow } from '@tarojs/taro'
import { watch } from 'vue'
import { apiGetFeedRecordList } from '../api'
import { type IHomeState } from '../types'

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
    setState((state) => (state.loading = true))

    const res = await apiGetFeedRecordList(state.pagination).finally(() => {
      setState((state) => (state.loading = false))
    })
    setState((state) => {
      state.feedRecords = res.list
    })
  }

  useDidShow(() => {
    init()
  })

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
              return (
                <div class='home-records-item' key={index}>
                  <div class='records-item-title'>{+record.type === 10 ? '奶粉' : '其他'}</div>
                  <div class='records-item-content'>{record.content}</div>
                  <div class='records-item-time'>
                    {dateFromNow(record.feedTime, {
                      today: '${h}小时${m}分钟前'
                    })}
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
