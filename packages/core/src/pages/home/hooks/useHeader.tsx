import { useAppStore } from '@/stores'
import { dateDiff, durationFormatNoZero, useDate } from '@mid-vue/shared'
import { computed, reactive, watch } from 'vue'
import { apiAddBabyFoster, apiBabyList } from '../api'
import { useDidShow } from '@tarojs/taro'
import { setBabyInfo } from '@/utils'
import { Image, Navbar, showDialog } from '@mid-vue/taro-h5-ui'
import imgBabyAvatar from '@/assets/images/img_baby_avatar.png'
import { useRoute } from '@/use'
import { useCtxState } from '@mid-vue/use'
import { IHomeState } from '../types'

export const useHeader = () => {
  const [state, setState] = useCtxState<IHomeState>()
  let query = useRoute<{ fid: number }>().query

  let appStore = useAppStore()
  watch(
    () => appStore.isLogin,
    (isLogin) => {
      isLogin && getBabyList()
      addBabyFoster()
    }
  )

  useDidShow(() => {
    addBabyFoster()
    getBabyList()
  })

  /** 添加邀请者一起喂养 */
  function addBabyFoster() {
    if (query.fid && appStore.familyId !== +query.fid) {
      showDialog({
        title: '提示',
        render: () => '是否同意加入一起喂养',
        onConfirm: async () => {
          await apiAddBabyFoster({
            familyId: query.fid
          })
          getBabyList()
        }
      })
    }
  }
  function getBabyList() {
    if (!appStore.isLogin) return
    apiBabyList().then((res) => {
      let babyInfo = res?.[0] || {}
      setState((state) => {
        state.babyInfo = babyInfo
      })

      setBabyInfo(babyInfo)
    })
  }

  let birthTimeRef = computed(() => {
    let { birthDate, birthTime } = state.babyInfo
    if (!birthDate) return ''
    let diffTime = dateDiff(
      Date.now(),
      useDate(birthDate)
        .format('YYYY-MM-DD ' + birthTime)
        .valueOf()
    )
    return durationFormatNoZero(diffTime, { format: 'Y岁M月D天H小时m分钟' })
  })

  return {
    render: () => (
      <div class='home-header'>
        <Navbar leftArrow={false} showHome={false}></Navbar>
        <div class='home-baby-info'>
          <Image class='baby-info-avatar' src={imgBabyAvatar}></Image>
          <div class='baby-info-content'>
            <div class='info-name'>{state.babyInfo.nickname}</div>
            <div class='info-time'>{birthTimeRef.value}</div>
          </div>
        </div>
      </div>
    )
  }
}
