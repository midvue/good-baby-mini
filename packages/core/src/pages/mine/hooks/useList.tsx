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

import { iconAboutMe, iconAged, iconBaby, iconInvite, iconSetting, iconWeChat } from '../assets'
import imgWeChat from '../assets/img_we_chat.jpg'
import { navigateTo } from '@/use'
import { useShareAppMessage } from '@tarojs/taro'
import { getBabyInfo } from '@/utils'

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
              showDialog({
                confirmOpenType: 'share',
                render() {
                  return <div>确定邀请家人一起喂养{babyInfo.nickname}嘛</div>
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
        },
        {
          component: () => renderItem('退出登录', iconSetting)
        }
      ]
    }
  ]

  useShareAppMessage((res) => {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '自定义转发标题',
      path: '/page/user?id=123'
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
