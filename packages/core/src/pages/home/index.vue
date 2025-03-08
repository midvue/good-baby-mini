<script lang="tsx">
import { defineComponent, watch } from 'vue'
import { useDidShow } from '@tarojs/taro'
import { hideLoading, Navbar, showLoading } from '@mid-vue/taro-h5-ui'
import { defineCtxState } from '@mid-vue/use'
import { useRecords, useTools } from './hooks'
import { type IHomeState } from './types'
import { apiGetFeedRecordList } from './api'
import { useAppStore } from '@/stores'

export default defineComponent({
  name: 'Home',
  setup() {
    const [state, setState] = defineCtxState<IHomeState>({
      loading: false,
      pagination: {
        current: 1,
        size: 20,
        total: 0
      },
      feedRecords: []
    })

    let appStore = useAppStore()
    watch(
      () => appStore.isLogin,
      (isLogin) => {
        isLogin && init()
      }
    )

    watch(
      () => state.loading,
      (loading) => {
        loading
          ? showLoading({
              title: '加载中'
            })
          : hideLoading()
      }
    )

    async function init() {
      if (!appStore.isLogin) return
      state.loading = true
      const res = await apiGetFeedRecordList(state.pagination).finally(() => {
        state.loading = false
      })
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
