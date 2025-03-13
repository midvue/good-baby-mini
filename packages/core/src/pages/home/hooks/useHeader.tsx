import { useAppStore } from '@/stores'
import { dateDiff, durationFormatNoZero, useDate } from '@mid-vue/shared'
import { computed, reactive, watch } from 'vue'
import { apiBabyList } from '../api'
import { useDidShow } from '@tarojs/taro'
import { setBabyInfo } from '@/utils'
import { Image, Navbar } from '@mid-vue/taro-h5-ui'
import imgBabyAvatar from '@/assets/images/img_baby_avatar.png'

export const useHeader = () => {
  //const [state, setState] = useCtxState<IHomeState>()

  const currState = reactive({
    babyInfo: {} as BabyInfo
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
      setBabyInfo(currState.babyInfo)
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
      <div class='home-header'>
        <Navbar leftArrow={false} showHome={false}></Navbar>
        <div class='home-baby-info'>
          <Image class='baby-info-avatar' src={imgBabyAvatar}></Image>
          <div class='baby-info-content'>
            <div class='info-name'>{currState.babyInfo.nickname}</div>
            <div class='info-time'>{birthTimeRef.value}</div>
          </div>
        </div>
      </div>
    )
  }
}
