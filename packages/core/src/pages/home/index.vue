<script lang="tsx">
import { defineComponent } from 'vue'
import { useDidShow } from '@tarojs/taro'
import { Navbar } from '@mid-vue/taro-h5-ui'
import { defineCtxState } from '@mid-vue/use'
import { useRecords, useTools } from './hooks'
import { type IHomeState } from './types'
import { apiGetFeedRecordList } from './api'

export default defineComponent({
  name: 'Home',
  setup() {
    const [state, setState] = defineCtxState<IHomeState>({
      pagination: {
        current: 1,
        size: 20,
        total: 0
      },
      feedRecords: []
    })

    async function init() {
      const res = await apiGetFeedRecordList(state.pagination)
      setState((state) => {
        state.feedRecords = res.list
      })
    }
    useDidShow(() => {
      init()
    })

    const { render: renderTools } = useTools()
    const { render: renderRecords } = useRecords()
    return () => {
      return (
        <div class='home'>
          <Navbar
            title='首页'
            defaultConfig={{
              frontColor: '#000000',
              backgroundColor: 'transparent'
            }}
          ></Navbar>
          {renderTools()}
          {renderRecords()}
        </div>
      )
    }
  }
})
</script>
<style lang="scss">
@import './index.scss';
</style>
