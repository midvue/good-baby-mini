import { ScrollView } from '@tarojs/components'
import { useCtxState } from '@mid-vue/use'
import { dateFromNow } from '@mid-vue/shared'
import { type IHomeState } from '../types'

/**  喂养记录 */
export const useRecords = () => {
  const [state, setState] = useCtxState<IHomeState>()

  return {
    render: () => (
      <div class='home-records'>
        <div class='home-records-header'>
          <div class='header-title'>喂养记录</div>
          <div class='header-more'>更多</div>
        </div>
        <ScrollView scrollY class='home-records-scroll' enable-flex>
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
        </ScrollView>
      </div>
    )
  }
}
