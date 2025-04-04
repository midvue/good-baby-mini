import imgAvatarFemale from '@/assets/images/img_avatar_female.png'
import imgAvatarMale from '@/assets/images/img_avatar_male.png'
import { BabyInfo } from '@/components/baby-info'
import { useAppStore } from '@/stores'
import { reLaunch, useRoute } from '@/use'
import { setBabyInfo } from '@/utils'
import { durationFormatNoZero, useDate } from '@mid-vue/shared'
import { Image, Navbar, showDialog, showPopup, Tag } from '@mid-vue/taro-h5-ui'
import { useCtxState } from '@mid-vue/use'
import { useDidShow } from '@tarojs/taro'
import { computed, watch } from 'vue'
import { apiAddBabyFoster, apiBabyList } from '../api'
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
          reLaunch({
            path: ENV_HOME_URL
          })
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
  //点击添加宝宝
  function onAddBaby() {
    // 未绑定宝宝
    showPopup({
      round: true,
      height: '60%',
      title: '添加宝宝',
      render(scoped) {
        return (
          <BabyInfo
            onClose={() => {
              scoped.close()
              getBabyList()
            }}
          ></BabyInfo>
        )
      }
    })
  }

  let birthTimeRef = computed(() => {
    let { birthDate, birthTime } = state.babyInfo
    if (!birthDate) return ''
    let now = useDate()
    let targetDate = useDate(birthDate)
    const months = now.diff(targetDate, 'month')
    const days = now.diff(useDate(targetDate, 'YYYY-MM-DD').add(months, 'month'), 'day').toString()
    let diff = now.diff(targetDate.format('YYYY-MM-DD ' + birthTime), 'millisecond')

    return `${months}个月${days.padStart(2, '0')}天 (${durationFormatNoZero(diff, { format: birthTime ? 'D天H小时' : '第D天' })})`
  })

  return {
    render: () => (
      <div class='home-header'>
        <Navbar leftArrow={false} showHome={false}></Navbar>
        <div class='home-baby-info'>
          <Image
            class='baby-info-avatar'
            src={state.babyInfo.gender === '20' ? imgAvatarMale : imgAvatarFemale}
          ></Image>
          <div class='baby-info-content'>
            <div class='info-name'>{state.babyInfo.nickname}</div>
            <div class='info-time'>{birthTimeRef.value}</div>
          </div>
          {!state.babyInfo.id && (
            <Tag type='primary' round onClick={onAddBaby}>
              请添加宝宝
            </Tag>
          )}
        </div>
      </div>
    )
  }
}
