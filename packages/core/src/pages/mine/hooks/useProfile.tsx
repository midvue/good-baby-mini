import { ref } from 'vue'
import { useDidShow } from '@tarojs/taro'
import { Icon, Image, Navbar } from '@mid-vue/taro-h5-ui'
import { useDate } from '@mid-vue/shared'
import imgBabyAvatar from '@/assets/images/img_baby_avatar.png'
import { navigateTo } from '@/use'
import { useAppStore } from '@/stores'
import { getFullImageUrl, getUserInfo } from '@/utils'
import { iconAchieve, iconFamily, iconCredit } from '../assets'
/** 用户信息 */
export const useProfile = () => {
  // 使用 ref 将 userInfo 转换为响应式引用
  const appstore = useAppStore()
  const userInfo = ref(getUserInfo())
  useDidShow(() => {
    userInfo.value = appstore.userInfo
  })

  const panels = [
    {
      icon: iconFamily,
      title: '家庭成员',
      click: () => {
        navigateTo({
          path: '/pages/sub-mine/family-manage/index'
        })
      }
    },
    {
      icon: iconAchieve,
      title: '成就',
      click: () => {
        navigateTo({
          path: '/pages/sub-home/report/index'
        })
      }
    },
    {
      icon: iconCredit,
      title: '积分',
      click: () => {
        navigateTo({
          path: '/pages/sub-mine/credit/index'
        })
      }
    }
  ]

  const renderMenuPanels = () => {
    return (
      <div class='profile-panel'>
        {panels.map((panel, index) => {
          return (
            <div class='profile-panel-item' key={index} onClick={() => panel.click?.()}>
              <Image class='panel-item-icon' src={panel.icon}></Image>
              <div class='panel-item-title'>{panel.title}</div>
            </div>
          )
        })}
      </div>
    )
  }
  return {
    render: () => (
      <div class='mine-profile'>
        <Image src={getFullImageUrl('mine/bg_mine_header.png')} class='profile-bg'></Image>
        <Navbar leftArrow={false} showHome={false}></Navbar>
        <div
          class='profile-content'
          onClick={() => navigateTo({ path: '/pages/sub-mine/edit-me/index' })}
        >
          <Image class='image-avatar' src={imgBabyAvatar}></Image>
          <div class='profile-info'>
            <div class='username'>
              <span>{userInfo.value.nickname || '微信用户' + userInfo.value.id}</span>
              <Icon name='arrow' color='#675d78' class='edit-arrow'></Icon>
            </div>
            <div class='register-time'>
              您加入奶娃星球{useDate().diff(userInfo.value.createTime, 'day')}天了
            </div>
          </div>
        </div>
        {renderMenuPanels()}
      </div>
    )
  }
}
