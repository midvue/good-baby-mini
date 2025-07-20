<script lang="tsx">
import { defineComponent } from 'vue'
import { Image, Navbar, SafeBottom, Swiper } from '@mid-vue/taro-h5-ui'
import { defineCtxState } from '@mid-vue/use'
import { navigateTo } from '@/use'
import { type ICentreState } from './types'
import iconLogo from './assets/icon_logo.png'

export default defineComponent({
  name: 'Centre',
  setup() {
    const [state] = defineCtxState<ICentreState>({
      banners: [
        {
          img: 'mine/bg_mine_header.png',
          alt: 'banner'
        },
        {
          img: 'mine/bg_mine_header.png',
          alt: 'banner'
        }
      ]
    })

    const menuItems = [
      {
        icon: iconLogo,
        title: 'ai取名',
        click: () => {
          navigateTo({
            path: '/pages/sub-centre/ai-name/index'
          })
        }
      },
      {
        icon: iconLogo,
        title: '生肖五行'
      },
      {
        icon: iconLogo,
        title: '红包记账'
      },
      {
        icon: iconLogo,
        title: '亲戚称呼'
      },
      {
        icon: iconLogo,
        title: '家谱'
      },
      {
        icon: iconLogo,
        title: '宫缩计时'
      },
      {
        icon: iconLogo,
        title: '例假计算'
      }
    ]

    return () => {
      return (
        <div class='centre'>
          <Navbar title=' ' showHome={false} leftArrow={false}></Navbar>
          <Swiper items={state.banners} swiperKey='img' class='centre-swiper'></Swiper>
          <div class='center-menu-list '>
            {menuItems.map((item, index) => (
              <div class='menu-item' key={index} onClick={() => item.click?.()}>
                <Image src={item.icon} class='menu-item-icon'></Image>
                <div class='menu-title'>{item.title}</div>
              </div>
            ))}
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
