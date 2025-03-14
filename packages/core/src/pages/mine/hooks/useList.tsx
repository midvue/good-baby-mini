import { Form, FormInstance, Icon, IFormItem, Image, showPopup } from '@mid-vue/taro-h5-ui'
import { ref } from 'vue'

import { BabyInfo } from '@/components/baby-info'
import { iconAboutMe, iconAged, iconBaby, iconInvite, iconSetting, iconWeChat } from '../assets'
import img_wechat from '../assets/img_wechat.jpg'

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
              showPopup({
                round: true,
                height: '50%',
                render(scoped) {
                  return <BabyInfo onClose={scoped.close}></BabyInfo>
                }
              })
            }
          }
        },
        {
          component: () => renderItem('邀请家人', iconInvite),
          attrs: { border: true }
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
                height: '90%',
                render(scoped) {
                  return (
                    <>
                      <div>小程序还在开发中，有需求可以群里反馈</div>
                      <Image src={img_wechat}></Image>
                    </>
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
