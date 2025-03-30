import {
  Form,
  FormInstance,
  Icon,
  IFormItem,
  Image,
  showDialog,
  showPopup
} from '@mid-vue/taro-h5-ui'
import { ref } from 'vue'

import { navigateTo } from '@/use'
import { getBabyInfo, getUserInfo } from '@/utils'
import Taro, { useShareAppMessage } from '@tarojs/taro'
import { iconAboutMe, iconAged, iconBaby, iconInvite, iconWeChat } from '../assets'
import imgWeChat from '../assets/img_we_chat.png'

/** 菜单列表 */
export let useList = () => {
  const formRef = ref<FormInstance>()

  function renderItem(label: string, icon: string) {
    return (
      <div class='mine-list-item'>
        <Image class='item-icon' src={icon}></Image>
        <span class='item-label'>{label}</span>
        <Icon name='arrow'></Icon>
      </div>
    )
  }

  const cells: IFormItem[] = [
    {
      attrs: {
        class: 'form-item-card'
      },
      children: [
        {
          component: () => renderItem('宝宝管理', iconBaby),
          attrs: {
            border: true,
            clickable: true,
            onClick() {
              navigateTo({
                path: '/pages/sub-home/baby-manage/index'
              })
            }
          }
        },
        {
          component: () => renderItem('邀请家人', iconInvite),
          attrs: {
            border: true,
            onClick() {
              let babyInfo = getBabyInfo()
              if (!babyInfo.id) {
                Taro.showToast({
                  title: '请先添加宝宝',
                  icon: 'none'
                })
                return
              }
              showDialog({
                confirmOpenType: 'share',
                render() {
                  return (
                    <div class='mv-dialog-content'>
                      <div>当前宝宝：{babyInfo.nickname}</div>
                      <div>确定邀请家人一起喂养嘛</div>
                    </div>
                  )
                }
              })
            }
          }
        },
        {
          component: () => renderItem('老年人模式', iconAged)
        }
      ]
    },
    {
      attrs: {
        class: 'form-item-card'
      },
      children: [
        {
          component: () => renderItem('关于我们', iconAboutMe),
          attrs: { border: true }
        },
        {
          component: () => renderItem('微信群反馈', iconWeChat),
          attrs: {
            border: true,
            onClick() {
              showPopup({
                round: true,
                height: '60%',
                render() {
                  return (
                    <div class='flex flex-col items-center'>
                      <div>小程序还在开发中，欢迎体验!</div>
                      <div>需要什么功能,可以截图扫码,群里反馈</div>
                      <Image class='w-[160px] h-[360px]' src={imgWeChat}></Image>
                    </div>
                  )
                }
              })
            }
          }
        }
        // {
        //   component: () => renderItem('退出登录', iconSetting)
        // }
      ]
    }
  ]

  useShareAppMessage((res) => {
    if (res.from === 'button') {
      let userInfo = getUserInfo()
      return {
        title: `${userInfo.nickname || ''}邀请您加入一起喂养`,
        path: `pages/home/index?fid=${userInfo.familyId}`
      }
    }
    return {
      title: '宝宝喂养，生肖，五行，家谱，点开查看！！',
      path: `pages/home/index`
    }
  })

  return {
    render: () => {
      return (
        <div class='mine-list'>
          <Form ref={formRef} cells={cells} labelWidth='0px'></Form>
        </div>
      )
    }
  }
}
