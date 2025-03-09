import { IBaby } from '@/components/baby-info'
import { useAppStore } from '@/stores'
import { dateDiff, durationFormatNoZero, useDate } from '@mid-vue/shared'
import { computed, reactive, watch } from 'vue'
import { apiBabyList } from '../api'
import { useDidShow } from '@tarojs/taro'

export const useBabyInfo = () => {
  //const [state, setState] = useCtxState<IHomeState>()

  const currState = reactive({
    babyInfo: {} as IBaby
  })

  let appStore = useAppStore()
  watch(
    () => appStore.isLogin,
    (isLogin) => {
      isLogin && getBabyList()
    }
  )

  useDidShow(() => {
    if (currState.babyInfo.id) return
    getBabyList()
  })

  function getBabyList() {
    if (!appStore.isLogin) return
    apiBabyList().then((res) => {
      currState.babyInfo = res?.[0] || {}
    })
  }

  let birthTimeRef = computed(() => {
    let birthTime = currState.babyInfo.birthTime
    if (!birthTime) return ''
    let diffTime = dateDiff(Date.now(), useDate(birthTime).valueOf())
    return durationFormatNoZero(diffTime, { format: 'Y岁M月D天H小时m分钟' })
  })

  return {
    render: () => (
      <div class='home-baby-info'>
        <div class='baby-info-avatar'></div>
        <div class='baby-info-content'>
          <div class='info-name'>{currState.babyInfo.nickname}</div>
          <div class='info-time'>{birthTimeRef.value}</div>
        </div>
      </div>
    )
  }
}
