import { ref } from 'vue'
import Taro, { useDidShow, useShareAppMessage } from '@tarojs/taro'
import {
  CopyButton,
  Form,
  type FormInstance,
  Icon,
  type IFormItem,
  Image,
  showDialog,
  showPopup,
  Tag
} from '@mid-vue/taro-h5-ui'

import { navigateTo, useDictList } from '@/use'
import { getBabyInfo, getUserInfo } from '@/utils'
import { iconAboutMe, iconBaby, iconInvite, iconWeChat } from '../assets'
import imgWeChat from '../assets/img_we_chat.png'
import { apiPostRelation } from '../api'
import { useAppStore } from '@/stores'

/** 菜单列表 */
export const useList = () => {
  const formRef = ref<FormInstance>()
  const parentsList = useDictList('FAMILY_RELATION')
  const relationRef = ref('')
  const acceptableRelations = ['100', '200']
  const familyList = ref<any[]>([])
  const appStore = useAppStore()
  const existingRelations = ref<any[]>([])
  const nonExistingRelations = ref<any[]>([])

  const getFamilyList = () => {
    apiPostRelation({
      id: getBabyInfo().familyId
    }).then((res) => {
      familyList.value = res
      const existingRelationCodes = res.map((item: { relation: any }) => item.relation)
      existingRelations.value = parentsList.filter((item) =>
        existingRelationCodes.includes(item.code)
      )
      nonExistingRelations.value = parentsList.filter(
        (item) => !existingRelationCodes.includes(item.code)
      )
      relationRef.value = nonExistingRelations.value[0].code
    })
  }
  useDidShow(() => {
    if (!getBabyInfo().familyId) return
    getFamilyList()
  })
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
              const babyInfo = getBabyInfo()
              if (!babyInfo.id) {
                Taro.showToast({
                  title: '请先添加宝宝',
                  icon: 'none',
                  duration: 2000
                })
                return
              }
              if (!acceptableRelations.includes(babyInfo.relation)) {
                Taro.showToast({
                  title: `只有${babyInfo.nickname}的爸爸妈妈才能邀请家人哦`,
                  icon: 'none'
                })
                return
              }
              showDialog({
                confirmOpenType: 'share',
                title: `${babyInfo.nickname}${babyInfo.relation === '100' ? '妈妈' : '爸爸'}邀请喂养`,
                confirmText: '邀请',
                onConfirm: async () => {
                  if (!relationRef.value) {
                    Taro.showToast({
                      title: '请选择邀请关系',
                      icon: 'none'
                    })
                    Taro.hideShareMenu()
                    return
                  }
                },
                render() {
                  return (
                    <div class='mv-dialog-content'>
                      <div class='dialog-item'>
                        <span>当前家人:</span>
                        <div class='tag'>
                          {existingRelations.value.map((item) => (
                            <Tag class='ml-[5px] tag' size='large' type='primary' plain={false}>
                              {item.name}
                            </Tag>
                          ))}
                        </div>
                      </div>
                      <div class='dialog-item'>
                        <span>可邀请家人:</span>
                        <div class='tag'>
                          {nonExistingRelations.value.map((item) => (
                            <Tag
                              class='ml-[5px]'
                              size='large'
                              type='primary'
                              plain={relationRef.value !== item.code}
                              onClick={() => {
                                relationRef.value = item.code
                              }}
                            >
                              {item.name}
                            </Tag>
                          ))}
                        </div>
                      </div>
                    </div>
                  )
                }
              })
            }
          }
        }
        // {
        //   component: () => renderItem('老年人模式', iconAged)
        // }
      ]
    },
    {
      attrs: {
        class: 'form-item-card'
      },
      children: [
        {
          component: () => renderItem('关于我们', iconAboutMe),
          attrs: {
            border: true,
            onClick: () => {
              navigateTo({
                path: '/pages/sub-mine/about-me/index'
              })
            }
          }
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
                      <div class='mt-[30px]'>小程序在持续迭代!数据会一直保留</div>
                      <div>需要什么功能,可以截图扫码,群里反馈</div>
                      <div class='text-[16px]'>
                        或者添加微信: goodbaby_66{' '}
                        <CopyButton text='goodbaby_66' class='text-[18px]'></CopyButton>
                      </div>
                      <Image
                        class='w-[160px] h-[160px] mt-[30px]'
                        src={imgWeChat}
                        show-menu-by-longpress
                      ></Image>
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
      const userInfo = getUserInfo()
      return {
        title: `${userInfo.nickname || ''}邀请您加入一起喂养`,
        path: `pages/home/index?fid=${appStore.babyInfo.familyId}&relation=${relationRef.value}`,
        imageUrl:
          'https://app-1359622524.cos.ap-guangzhou.myqcloud.com/good-baby-mini/image/share.jpg'
      }
    }
    return {
      title: '宝宝喂养，生肖，五行，家谱，点开查看！！',
      path: 'pages/home/index',
      imageUrl:
        'https://app-1359622524.cos.ap-guangzhou.myqcloud.com/good-baby-mini/image/share.jpg'
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
