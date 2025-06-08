<script lang="tsx">
import { defineComponent } from 'vue'
import Taro from '@tarojs/taro'
import { Image } from '@mid-vue/taro-h5-ui'
import { EnumFeedType } from '@/dict'
import { navigateTo } from '@/use'
import imgToolMilk from '../assets/icon_tool_milk.png'
import imgToolDiaper from '../assets/icon_tool_diaper.png'
import imgToolWeight from '../assets/icon_tool_weight.png'
import imgToolVaccine from '../assets/icon_tool_vaccine.png'
import imgToolSupplement from '../assets/icon_tool_supplement.png'
import imgToolSleep from '../assets/icon_tool_sleep.png'
import imgToolFood from '../assets/icon_tool_food.png'

export default defineComponent({
  name: 'ToolsList',

  setup() {
    const moreToolsConfList = [
      {
        feedType: EnumFeedType.MILK_BOTTLE,
        name: '喂奶',
        icon: imgToolMilk,
        bgColor: '#FFF7F8',
        path: '/feed-milk/index'
      },
      {
        feedType: EnumFeedType.DIAPER,
        name: '尿片',
        icon: imgToolDiaper,
        bgColor: '#FAF6FF',
        path: '/diapering/index'
      },
      {
        feedType: EnumFeedType.HEIGHT_WEIGHT,
        name: '体重',
        icon: imgToolWeight,
        bgColor: '#FFFAF0',
        path: '/height-weight/index'
      },
      {
        feedType: EnumFeedType.VACCINE,
        name: '疫苗',
        icon: imgToolVaccine,
        bgColor: '#FFF6F7',
        path: ''
      },
      {
        feedType: EnumFeedType.SUPPLEMENT,
        name: '补剂',
        icon: imgToolSupplement,
        bgColor: '#F9F6FF',
        path: ''
      },
      {
        feedType: EnumFeedType.SLEEP,
        name: '睡眠',
        icon: imgToolSleep,
        bgColor: '#F4F7FF',
        path: ''
      },
      {
        feedType: EnumFeedType.BABY_FOOD,
        name: '辅食',
        icon: imgToolFood,
        bgColor: '#FEF9F3',
        path: ''
      }
    ]
    return () => {
      return (
        <div class='home-tools-popup'>
          {moreToolsConfList.map((tool) => (
            <div
              class={`tool-item ${tool.bgColor}`}
              key={tool.feedType}
              style={{
                backgroundColor: tool.bgColor
              }}
              onClick={() => {
                if (tool.path === '') {
                  Taro.showToast({ title: '功能还在开发中,敬请期待!', icon: 'none' })
                  return
                }
                navigateTo({
                  path: '/pages/sub-home' + tool.path
                })
              }}
            >
              <Image src={tool.icon} class='tool-item-icon'></Image>
              <div class='tool-item-name'>{tool.name}</div>
            </div>
          ))}
        </div>
      )
    }
  }
})
</script>
<style lang="scss">
@import './index.scss';
</style>
