import { Image, Navbar } from '@mid-vue/taro-h5-ui'
import { getUserInfo } from '@/utils'
import { bgMineHeader, iconAchieve, iconFamily } from '../assets'
import imgBabyAvatar from '@/assets/images/img_baby_avatar.png'
import { durationFormat, durationFormatNoZero, useDate } from '@mid-vue/shared'
import { navigateTo } from '@/use'

/** 用户信息 */
export let useProfile = () => {
  let userInfo = getUserInfo()

  let panels = [
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
      title: '成就'
    },
    {
      icon: iconFamily,
      title: '积分'
    }
  ]

  let renderMenuPanels = () => {
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
        <Image src={bgMineHeader} class='profile-bg'></Image>
        <Navbar leftArrow={false} showHome={false}></Navbar>
        <div class='profile-content'>
          <Image class='image-avatar' src={imgBabyAvatar}></Image>
          <div class='profile-info'>
            <div class='username'>微信用户 {userInfo.id}</div>
            <div class='register-time'>
              加入好宝宝喂养{useDate().diff(userInfo.createTime, 'day')}天了
            </div>
          </div>
        </div>
        {renderMenuPanels()}
      </div>
    )
  }
}
