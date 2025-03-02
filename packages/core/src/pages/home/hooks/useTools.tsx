import { reactive } from 'vue'
import Taro from '@tarojs/taro'
import { useCtxState } from '@mid-vue/use'
import { Button } from '@mid-vue/taro-h5-ui'
import { dateFromNow } from '@mid-vue/shared'
import { type IHomeState } from '../types'

export const useTools = () => {
  const [state, setState] = useCtxState<IHomeState>()

  const currState = reactive({
    tools: []
  })

  const toolsConfList = [
    {
      feedType: 10,
      name: '奶粉',
      render: () => {
        return <div class='home-tools-card'>111</div>
      }
    },
    { feedType: 20, updateTime: 0, name: '尿布' },
    { feedType: 30, updateTime: 0, name: '其他' }
  ]

  const formatFeedTime = (feedType: number) => {
    const record = state.feedRecords.find((item) => +item.type === feedType)
    if (!record) return ''
    return dateFromNow(record.feedTime, {
      today: '${h}小时${m}分钟前'
    })
  }

  return {
    render: () => (
      <div class='home-tools'>
        {toolsConfList.map((tool, index) => {
          return (
            <div class='home-tools-card' key={index}>
              <div class='card-title'>{tool.name}</div>
              <div class='card-content'>150ml</div>
              <div class='card-time'>{formatFeedTime(tool.feedType)}</div>
            </div>
          )
        })}
      </div>
    )
  }
}
