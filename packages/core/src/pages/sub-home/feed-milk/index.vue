<script lang="tsx">
import { computed, defineComponent, reactive } from 'vue'
import { Navbar, Tag } from '@allkit/taro-h5-ui'
import { useRoute } from '@/use'

import { EnumFeedType } from '@/dict'
import { MilkBottleFeed } from './components/milk-bottle-feed'
import { BreastMilkFeed } from './components/breast-milk-feed'

export default defineComponent({
  name: 'FeedMilk',
  setup() {
    const { query } = useRoute<IFeedRecord<IMilkBottle | IBreastMilk>>()

    const feedType = +query.feedType ? +query.feedType : EnumFeedType.MILK_BOTTLE
    const state = reactive({
      feedType
    })

    const feedTypeList = [
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

    const milkData = computed(() => {
      if (state.feedType === feedType) {
        return query
      }
      return undefined
    })

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
          {!query.id && (
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
          )}
          {state.feedType === EnumFeedType.MILK_BOTTLE ? (
            <MilkBottleFeed data={milkData.value as IFeedRecord<IMilkBottle>}></MilkBottleFeed>
          ) : (
            <BreastMilkFeed data={milkData.value as IFeedRecord<IBreastMilk>}></BreastMilkFeed>
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
