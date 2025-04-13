<script lang="tsx">
import { EnumFeedType } from '@/dict'
import { useDictList, useDictMap } from '@/use'
import { defineComponent, PropType } from 'vue'
import IconFeedDiaper from './assets/icon_feed_diaper.png'
import iconFeedHeight from './assets/icon_feed_height.png'
import iconFeedMilk from './assets/icon_feed_milk.png'
import iconFeedBreast from './assets/icon_feed_breast.png'
import { Image } from '@mid-vue/taro-h5-ui'
import { durationFormatNoZero } from '@mid-vue/shared'
export default defineComponent({
  name: 'feed-record',
  props: {
    data: {
      type: Object as PropType<IFeedRecord>,
      default: () => ({})
    }
  },
  setup(props) {
    const feedTypeList = useDictList('FEED_TYPE')
    let feedTypeMap = useDictMap('FEED_TYPE')
    let milkTypeMap = useDictMap('MILK_TYPE')
    let diaperTypeMap = useDictMap('DIAPER_TYPE')
    let poopTypeMap = useDictMap('POOP_TYPE')
    const poopColorMap = useDictMap('POOP_COLOR')

    let feedTypeStrategy = {
      /** 奶粉 */
      [EnumFeedType.MILK_BOTTLE]: {
        path: '/pages/sub-home/feed-milk/index',
        render: (content: IFeedRecord['content']) => {
          let { volume, type } = content as IMilkBottle
          return (
            <div class='feed-record-item-wrapper'>
              <div class='record-item-logo'>
                <Image src={iconFeedMilk} class='item-logo-img'></Image>
              </div>
              <div>
                <div class='records-item-title'>{milkTypeMap[type]?.name}</div>
                <div class='records-item-content'>
                  总量:<span class='content-volume'> {volume}</span> ml
                </div>
              </div>
            </div>
          )
        }
      },
      /** 母乳亲喂 */
      [EnumFeedType.BREAST_FEED_DIRECT]: {
        path: '/pages/sub-home/feed-milk/index',
        render: (content: IFeedRecord['content']) => {
          let { duration, leftDuration, rightDuration } = content as IBreastMilk
          return (
            <div class='feed-record-item-wrapper'>
              <div class='record-item-logo'>
                <Image src={iconFeedBreast} class='item-logo-img'></Image>
              </div>
              <div>
                <div class='records-item-title'>
                  母乳亲喂
                  <span class='item-title-duration'>
                    (总时长:
                    {durationFormatNoZero(duration, { unit: 's', format: 'm分钟s秒' })})
                  </span>
                </div>
                <div class='records-item-content'>
                  <div v-show={leftDuration} class='mr-[5px]'>
                    左侧:
                    <span>
                      {durationFormatNoZero(leftDuration, { unit: 's', format: 'm分钟s秒' })}
                    </span>
                  </div>
                  <div v-show={rightDuration}>
                    右侧:
                    <span>
                      {durationFormatNoZero(rightDuration, { unit: 's', format: 'm分钟s秒' })}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )
        }
      },
      /** 尿布 */
      [EnumFeedType.DIAPER]: {
        path: '/pages/sub-home/diapering/index',
        render: (content: IFeedRecord['content']) => {
          let { type, poopType, poopColor } = content as IDiaper
          return (
            <div class='feed-record-item-wrapper'>
              <div class='record-item-logo'>
                <Image src={IconFeedDiaper} class='item-logo-img'></Image>
              </div>
              <div>
                <div class='records-item-title'>{diaperTypeMap[type]?.name}</div>
                <div class='records-item-content content-diaper'>
                  {poopTypeMap[poopType]?.name}{' '}
                  <span
                    class='diaper-color'
                    style={{ background: poopColorMap[poopColor]?.ext }}
                  ></span>
                </div>
              </div>
            </div>
          )
        }
      },
      [EnumFeedType.HEIGHT_WEIGHT]: {
        path: '/pages/sub-home/height-weight/index',
        render: (content: IFeedRecord['content']) => {
          let { weight, height } = content as IHeightWeight
          return (
            <div class='feed-record-item-wrapper'>
              <div class='record-item-logo'>
                <Image src={iconFeedHeight} class='item-logo-img'></Image>
              </div>
              <div>
                <div class='records-item-title'>身高: {height} cm</div>
                <div class='records-item-content'>体重: {weight} kg</div>
              </div>
            </div>
          )
        }
      }
    } as const

    let renderContent = () => {
      let record = props.data
      if ('feedType' in record) {
        let feedType = record.feedType
        let strategy = feedTypeStrategy[feedType]
        return (
          <div class={['feed-record-item', 'records-item-' + feedType]}>
            <div class='records-item-time'>{record.feedTimeStr}</div>
            {strategy?.render(record.content)}
          </div>
        )
      }
      return (
        <div class='feed-record-summary'>
          <span class='records-summary-time'>{record.feedTimeStr}</span>
          <div class='feed-record-summary-wrapper '>
            {feedTypeList.map((dict, index) => {
              let code = dict.code as `${EnumFeedType}`
              let summary = record[code]
              if (!summary) return null
              return (
                <div class='summary-item' key={code + index}>
                  <span class='summary-item-label'>{feedTypeMap[code]?.name} </span>
                  <span class='content-number'>{summary.count}</span> 次
                  {!!summary.content.volume && (
                    <>
                      <span class='ml-[5px]'>({summary.content.label}: </span>
                      <span class='content-number'>{summary.content.volume}</span> ml)
                    </>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )
    }

    return () => <div class='feed-record'>{renderContent()}</div>
  }
})
</script>
<style lang="scss">
@import './index.scss';
</style>
