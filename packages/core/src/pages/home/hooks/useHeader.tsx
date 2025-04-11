import imgAvatarFemale from '@/assets/images/img_avatar_female.png'
import imgAvatarMale from '@/assets/images/img_avatar_male.png'
import { BabyInfo, IBaby } from '@/components/baby-info'
import { useAppStore } from '@/stores'
import { navigateTo, reLaunch, useRoute } from '@/use'
import { durationFormatNoZero, EnumYesNoPlus, useDate } from '@mid-vue/shared'
import { Image, Navbar, showDialog, showPopup, Tag } from '@mid-vue/taro-h5-ui'
import { useDidShow } from '@tarojs/taro'
import { computed, reactive, watch } from 'vue'
import { apiAddBabyFoster, apiBabyList } from '../api'

export const useHeader = () => {
  let query = useRoute<{ fid: number }>().query

  let appStore = useAppStore()

  let currState = reactive({ babyList: [] as IBaby[] })
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

    apiBabyList().then((list) => {
      currState.babyList = list || []
      if (!appStore.babyInfo.id) {
        let babyInfo = list?.[0] || {}
        appStore.setBabyInfo(babyInfo)
      }
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

  /** 切换宝宝 */
  function onChangeBaby() {
    navigateTo({
      path: '/pages/sub-home/baby-manage/index',
      query: {
        isChange: EnumYesNoPlus.YES
      }
    })
  }

  let birthTimeRef = computed(() => {
    let { birthDate, birthTime } = appStore.babyInfo
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
            src={appStore.babyInfo.gender === '20' ? imgAvatarMale : imgAvatarFemale}
          ></Image>
          <div class='baby-info-content'>
            <div class='info-name'>{appStore.babyInfo.nickname}</div>
            <div class='info-time'>{birthTimeRef.value}</div>
          </div>
          {!appStore.babyInfo.id && (
            <Tag type='primary' round onClick={onAddBaby}>
              请添加宝宝
            </Tag>
          )}
          {currState.babyList.length > 1 && (
            <Tag class='ml-[20px]' type='primary' round onClick={onChangeBaby}>
              切换宝宝
            </Tag>
          )}
        </div>
      </div>
    )
  }
}
