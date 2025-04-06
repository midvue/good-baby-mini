<script lang="tsx">
import { useRoute } from '@/use'

import { Navbar, Tag } from '@mid-vue/taro-h5-ui'
import { defineComponent, reactive } from 'vue'
import { MilkBottleFeed } from './components/milk-bottle-feed'
import { EnumFeedType } from '@/dict'
import { BreastMilkFeed } from './components/breast-milk-feed'

export default defineComponent({
  name: 'FeedMilk',
  setup() {
    const { query } = useRoute<IFeedRecord<IMilkBottle | IBreastMilk>>()

    let state = reactive({
      feedType: EnumFeedType.BREAST_FEED_DIRECT
    })

    let feedTypeList = [
      {
        label: '母乳亲喂',
        value: EnumFeedType.BREAST_FEED_DIRECT,
        className: ''
      },
      {
        label: '奶瓶喂养',
        value: EnumFeedType.MILK_BOTTLE,
        className: 'ml-[10px]'
      }
    ]

    return () => {
      return (
        <div class='feed-milk'>
          <Navbar
            title='奶瓶喂养'
            defaultConfig={{
              frontColor: '#000000',
              backgroundColor: 'transparent'
            }}
          ></Navbar>
          <div class='feed-milk-header'>
            {feedTypeList.map((item) => {
              return (
                <Tag
                  type={state.feedType === item.value ? 'primary' : 'default'}
                  plain={state.feedType !== item.value}
                  round
                  size='large'
                  class={item.className}
                  key={item.value}
                  onClick={() => {
                    state.feedType = item.value
                  }}
                >
                  {item.label}
                </Tag>
              )
            })}
          </div>
          {state.feedType === EnumFeedType.MILK_BOTTLE ? (
            <MilkBottleFeed></MilkBottleFeed>
          ) : (
            <BreastMilkFeed></BreastMilkFeed>
          )}
        </div>
      )
    }
  }
})
</script>
<style lang="scss">
@import './index.scss';
</style>
