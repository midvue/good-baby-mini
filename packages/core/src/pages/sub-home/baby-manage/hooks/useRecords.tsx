import { ScrollView } from '@tarojs/components'
import { useCtxState } from '@mid-vue/use'
import { dateFromNow } from '@mid-vue/shared'
import { type IFeedMilkState } from '../types'

/**  喂养记录 */
export const useRecords = () => {
  const [state, setState] = useCtxState<IFeedMilkState>()

  return {
    render: () => (
      <div class='feed-milk-records'>
        <div class='feed-milk-records-header'>
          <div class='header-title'>喂养记录</div>
          <div class='header-more'>更多</div>
        </div>
        <ScrollView scrollY class='feed-milk-records-scroll'>
          {state.feedRecords.map((record) => {
            return (
              <div class='feed-milk-records-item'>
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
        </ScrollView>
      </div>
    )
  }
}
