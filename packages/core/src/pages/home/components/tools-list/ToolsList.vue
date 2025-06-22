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
import imgToolJaundice from '../assets/icon_tool_jaundice.png'
import imgToolBreast from '../assets/icon_tool_breast.png'

export default defineComponent({
  name: 'ToolsList',
  emits: ['close'],
  setup(_, { emit }) {
    const moreToolsConfList = [
      {
        feedType: EnumFeedType.MILK_BOTTLE,
        name: '奶瓶喂养',
        icon: imgToolMilk,
        bgColor: '#FFF7F8',
        path: '/feed-milk/index',
        query: {
          feedType: '10'
        }
      },
      {
        feedType: EnumFeedType.BREAST_FEED_DIRECT,
        name: '母乳喂养',
        icon: imgToolBreast,
        bgColor: '#FFF7F8',
        path: '/feed-milk/index',
        query: {
          feedType: '20'
        }
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
        feedType: EnumFeedType.JAUNDICE,
        name: '黄疸',
        icon: imgToolJaundice,
        bgColor: '#FFFAF0',
        path: '/jaundice/index'
      },
      {
        feedType: EnumFeedType.SLEEP,
        name: '睡眠',
        icon: imgToolSleep,
        bgColor: '#F4F7FF',
        path: '/sleep/index'
      },
      {
        feedType: EnumFeedType.FOOD,
        name: '辅食',
        icon: imgToolFood,
        bgColor: '#FEF9F3',
        path: '/food/index'
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
      }
      // {
      //   feedType: EnumFeedType.SUPPLEMENT,
      //   name: '用药',
      //   icon: imgToolSupplement,
      //   bgColor: '#F9F6FF',
      //   path: ''
      // },
      // {
      //   feedType: EnumFeedType.SUPPLEMENT,
      //   name: '体温',
      //   icon: imgToolSupplement,
      //   bgColor: '#F9F6FF',
      //   path: ''
      // }
    ]
    const onItemClick = (tool) => {
      if (tool.path === '') {
        Taro.showToast({ title: '功能还在开发中,敬请期待!', icon: 'none' })
        return
      }
      navigateTo({
        path: '/pages/sub-home' + tool.path,
        query: tool.query
      })
      emit('close')
    }
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
              onClick={() => onItemClick(tool)}
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
