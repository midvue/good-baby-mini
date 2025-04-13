<script lang="tsx">
import iconLogo from '@/assets/images/icon_logo.png'
import { Image, Navbar } from '@mid-vue/taro-h5-ui'
import { defineComponent } from 'vue'
import imgAvatarFly from './assets/img_avatar_fly.jpg'
import imgAvatarGarbao from './assets/img_avatar_garbao.jpg'
import imgAvatarPoetek from './assets/img_avatar_poetek.jpg'
import imgAvatarSpig from './assets/img_avatar_spig.jpg'

export default defineComponent({
  name: 'family-manage',
  setup() {
    let teams = [
      {
        name: 'Spig',
        avatar: imgAvatarSpig
      },
      {
        name: 'Fly',
        avatar: imgAvatarFly
      },
      {
        name: 'Garbao',
        avatar: imgAvatarGarbao
      },
      {
        name: 'Poetek',
        avatar: imgAvatarPoetek
      }
    ]

    return () => {
      return (
        <div class='about-me'>
          <Navbar
            title='关于我们'
            autoTheme
            defaultConfig={{
              frontColor: '#000000',
              backgroundColor: 'transparent'
            }}
          ></Navbar>
          <div class='about-me-header'>
            <Image mode='aspectFill' class='header-logo' src={iconLogo}></Image>
            <span>好宝宝喂养工具</span>
          </div>
          <div class='about-me-intro'>
            <span>我是Spig,2024年12月18日,我们家迎来了一位新成员,我也成了一只新手奶爸</span>
            <span>
              以前喂养用的月嫂的笔记本记录!!后面由朋友推荐,也用过好几款好用app软件,比如美柚,宝宝树,喂养日记之类的;
            </span>
            <span>但是除了喂养,我还需要关于宝宝周边的很多功能,得多个app来回切换</span>
            <span>
              索性我们就开发了这块集成工具小程序!!,包含家庭成员,亲戚称呼,红包管理,五行生肖之类,后续会考虑ai配合取名等功能
            </span>
          </div>
          <div class='about-me-team'>
            <span class='team-title'>核心团队</span>
            <div class='team-list'>
              {teams.map((person) => {
                return (
                  <div class='team-list-item'>
                    <Image class='list-item-avatar' src={person.avatar}></Image>
                    <span>{person.name}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )
    }
  }
})
</script>
<style lang="scss">
@import './index.scss';
</style>
