<script lang="tsx">
import { defineComponent } from 'vue'
import { Image, Navbar, SafeBottom, showToast, Swiper } from '@mid-vue/taro-h5-ui'
import { defineCtxState } from '@mid-vue/use'
import { navigateTo } from '@/use'
import { type ICentreState } from './types'

export default defineComponent({
  name: 'Centre',
  setup() {
    const [state] = defineCtxState<ICentreState>({
      banners: [
        {
          img: 'centre/img_center_header.png'
        }
      ]
    })

    const menuItems = [
      {
        icon: 'centre/icon_ai_name.png',
        title: 'ai取名',
        click: () => {
          navigateTo({
            path: '/pages/sub-centre/ai-name/index'
          })
        }
      },
      {
        icon: 'centre/icon_uterine_contraction.png',
        title: '宫缩计时',
        click: () => {
          navigateTo({
            path: '/pages/sub-centre/uterine-contraction/index'
          })
        }
      },

      {
        icon: 'centre/icon_red_packet.png',
        title: '红包记账'
      },
      {
        icon: 'centre/icon_fetal_movement.png',
        title: '胎动记录'
      },
      {
        icon: 'centre/icon_five_elements.png',
        title: '生肖五行'
      },
      {
        icon: 'centre/icon_kin_relative.png',

        title: '亲戚称呼'
      },
      {
        icon: 'centre/icon_family_tree.png',
        title: '家谱'
      },
      {
        icon: 'centre/icon_family_tree.png',
        title: '邀请函',
        click: () => {
          navigateTo({
            path: '/pages/sub-mine/invitation-letter/index'
          })
        }
      }
    ]

    return () => {
      return (
        <div class='centre'>
          <Navbar title=' ' showHome={false} leftArrow={false} clearfix={false}></Navbar>
          <Swiper items={state.banners} swiperKey='img' class='centre-swiper'></Swiper>
          <div class='center-menu-list '>
            {menuItems.map((item, index) => {
              const isClick = !!item.click
              return (
                <div
                  class='menu-item'
                  style={{
                    filter: !isClick || item.title === '邀请函' ? 'grayscale(100%)' : 'none'
                  }}
                  key={index}
                  onClick={() => {
                    isClick ? item.click() : showToast('暂未开放')
                  }}
                >
                  <Image src={item.icon} class='menu-item-icon'></Image>
                  <div class='menu-title'>{item.title}</div>
                </div>
              )
            })}
          </div>
          <SafeBottom></SafeBottom>
        </div>
      )
    }
  }
})
</script>
<style lang="scss">
@import './index.scss';
</style>
