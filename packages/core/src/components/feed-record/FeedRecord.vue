<script lang="tsx">
import { defineComponent, type PropType } from 'vue'
import { Image, showDialog, Tag } from '@mid-vue/taro-h5-ui'
import { durationFormatNoZero } from '@mid-vue/shared'
import { EnumFeedType } from '@/dict'
import { navigateTo, useDictList, useDictMap } from '@/use'
import IconFeedDiaper from '@/assets/images/icon_feed_diaper.png'
import iconFeedHeight from '@/assets/images/icon_feed_height.png'
import iconFeedMilk from '@/assets/images/icon_feed_milk.png'
import iconFeedBreast from '@/assets/images/icon_feed_breast.png'
import iconFeedFood from '@/assets/images/icon_feed_food.png'
import iconFeedJaundice from '@/assets/images/icon_feed_jaundice.png'
import iconFeedSleep from '@/assets/images/icon_feed_sleep.png'
import iconFeedDegress from '@/assets/images/icon_feed_degress.png'
import iconFeedSupplement from '@/assets/images/icon_feed_supplement.png'
import iconFeedMedicine from '@/assets/images/icon_feed_medicine.png'

import { calculateBabyMonths, DegressBtn } from '@/components/degress-btn'
import { getBabyInfo } from '@/utils'
import { StarRating } from '@/components/star-rating'
import { type SummaryFeedRecord } from './types'
import { apiDeleteFeedRecord } from './api'
export default defineComponent({
  name: 'FeedRecord',
  props: {
    data: {
      type: Object as PropType<IFeedRecord | SummaryFeedRecord>,
      default: () => ({})
    }
  },
  emits: ['deleted'],
  setup(props, { emit }) {
    const feedTypeList = useDictList('FEED_TYPE')
    const feedTypeMap = useDictMap('FEED_TYPE')
    const milkTypeMap = useDictMap('MILK_TYPE')
    const diaperTypeMap = useDictMap('DIAPER_TYPE')
    const poopTypeMap = useDictMap('POOP_TYPE')
    const poopColorMap = useDictMap('POOP_COLOR')
    const sleepTypeMap = useDictMap('SLEEP_TYPE')
    const sleepQualityMap = useDictMap('SLEEP_QUALITY')
    const foodTypeMap = useDictMap('FOOD_TYPE')
    const foodDurationMap = useDictMap('FOOD_DURATION')
    const foodFeedbackMap = useDictMap('FOOD_FEEDBACK')
    const foodAmountUnitMap = useDictMap('FOOD_UNIT')

    const feedTypeStrategy = {
      /** 奶粉 */
      [EnumFeedType.MILK_BOTTLE]: {
        path: '/pages/sub-home/feed-milk/index',
        render: (content: IFeedRecord['content']) => {
          const { volume, type } = content as IMilkBottle
          return (
            <div class='feed-record-item-wrapper'>
              <div class='record-item-logo'>
                <Image src={iconFeedMilk} class='item-logo-img'></Image>
              </div>
              <div>
                <div class='record-item-title'>{milkTypeMap[type]?.name}</div>
                <div class='record-item-content'>
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
          const { duration, leftDuration, rightDuration } = content as IBreastMilk
          return (
            <div class='feed-record-item-wrapper'>
              <div class='record-item-logo'>
                <Image src={iconFeedBreast} class='item-logo-img'></Image>
              </div>
              <div>
                <div class='record-item-title'>
                  母乳亲喂
                  <span class='item-title-duration'>
                    (总时长:
                    {durationFormatNoZero(duration, { unit: 's', format: 'm分钟s秒' })})
                  </span>
                </div>
                <div class='record-item-content'>
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
          const { type, poopType, poopColor } = content as IDiaper
          return (
            <div class='feed-record-item-wrapper'>
              <div class='record-item-logo'>
                <Image src={IconFeedDiaper} class='item-logo-img'></Image>
              </div>
              <div>
                <div class='record-item-title'>{diaperTypeMap[type]?.name}</div>
                <div class='record-item-content content-diaper'>
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
          const { weight, height } = content as IHeightWeight
          return (
            <div class='feed-record-item-wrapper'>
              <div class='record-item-logo'>
                <Image src={iconFeedHeight} class='item-logo-img'></Image>
              </div>
              <div>
                <div class='record-item-title'>身高: {height} cm</div>
                <div class='record-item-content'>体重: {weight} kg</div>
              </div>
            </div>
          )
        }
      },
      /** 黄疸 */
      [EnumFeedType.JAUNDICE]: {
        path: '/pages/sub-home/jaundice/index',
        render: (content: IFeedRecord['content']) => {
          const { unit, value } = content as IJaundice
          return (
            <div class='feed-record-item-wrapper'>
              <div class='record-item-logo'>
                <Image src={iconFeedJaundice} class='item-logo-img'></Image>
              </div>
              <div>
                <div class='record-item-title'>
                  黄疸: {value} {unit}
                </div>
              </div>
            </div>
          )
        }
      },
      /** 睡眠 */
      [EnumFeedType.SLEEP]: {
        path: '/pages/sub-home/sleep/index',
        render: (content: IFeedRecord['content']) => {
          const { duration, sleepType, quality, starRating } = content as ISleep
          return (
            <div class='feed-record-item-wrapper'>
              <div class='record-item-logo'>
                <Image src={iconFeedSleep} class='item-logo-img'></Image>
              </div>
              <div>
                <div class='record-item-title'>
                  睡眠: {durationFormatNoZero(duration, { unit: 's', format: 'H小时m分钟s秒' })}
                </div>
                <div class='record-item-content'>
                  <span class='mr-[10px]'>{sleepTypeMap[sleepType]?.name}</span>
                  {quality && <span> 质量: {sleepQualityMap[quality]?.name}</span>}
                  {starRating && <StarRating size='small' v-model={starRating} />}
                </div>
              </div>
            </div>
          )
        }
      },
      /** 辅食 */
      [EnumFeedType.FOOD]: {
        path: '/pages/sub-home/food/index',
        render: (content: IFeedRecord['content']) => {
          const { duration, type, foodAmount, foodAmountUnit, feedback } = content as IFood
          return (
            <div class='feed-record-item-wrapper'>
              <div class='record-item-logo'>
                <Image src={iconFeedFood} class='item-logo-img'></Image>
              </div>
              <div>
                <div class='record-item-title'>
                  <span class='item-title-duration'>
                    {foodTypeMap[type]?.name}
                    {foodAmount}({foodAmountUnitMap[foodAmountUnit]?.name})
                  </span>
                </div>
                <div class='record-item-content'>
                  <div class='mr-[5px]'>{foodDurationMap[duration]?.name}</div>
                  <div>
                    反馈:
                    {foodFeedbackMap[feedback]?.name}
                  </div>
                </div>
              </div>
            </div>
          )
        }
      } /** 体温 */,
      [EnumFeedType.DEGRESS]: {
        path: '/pages/sub-home/degress/index',
        render: (content: IFeedRecord['content']) => {
          const { temperature } = content as IDegress
          return (
            <div class='feed-record-item-wrapper'>
              <div class='record-item-logo'>
                <Image src={iconFeedDegress} class='item-logo-img'></Image>
              </div>
              <div>
                <div class='record-item-title'>
                  <span class='item-title-duration'>体温</span>
                </div>
                <div class='record-item-content'>
                  <div class='mr-[5px]'>
                    <span class='mr-[10px]'>{temperature}℃</span>
                    <DegressBtn
                      key={temperature}
                      age={calculateBabyMonths(getBabyInfo().birthDate)}
                      temperature={Number(temperature)}
                    />
                  </div>
                </div>
              </div>
            </div>
          )
        }
      },
      [EnumFeedType.SUPPLEMENT]: {
        path: '/pages/sub-home/supplement/index',
        render: (content: IFeedRecord['content'], remark?: string) => {
          const { name } = content as ISupplement
          return (
            <div class='feed-record-item-wrapper'>
              <div class='record-item-logo'>
                <Image src={iconFeedSupplement} class='item-logo-img'></Image>
              </div>
              <div>
                <div class='record-item-title'>补剂: {name}</div>
                <div class='record-item-content'>{remark}</div>
              </div>
            </div>
          )
        }
      },
      [EnumFeedType.VACCINE]: {
        path: '/pages/sub-home/vaccine/index',
        render: () => null
      },
      [EnumFeedType.MEDICINE]: {
        path: '/pages/sub-home/medicine/index',
        render: (content: IFeedRecord['content'], remark?: string) => {
          const { name } = content as IMedicine
          return (
            <div class='feed-record-item-wrapper'>
              <div class='record-item-logo'>
                <Image src={iconFeedMedicine} class='item-logo-img'></Image>
              </div>
              <div>
                <div class='record-item-title'>药物: {name}</div>
                <div class='record-item-content'>{remark}</div>
              </div>
            </div>
          )
        }
      }
    } as const

    const onRecordsItemClick = (record: IFeedRecord) => {
      const strategy = feedTypeStrategy[record.feedType]
      navigateTo({
        path: strategy.path,
        query: record
      })
    }
    const onDeleteRecord = (record: IFeedRecord) => {
      showDialog({
        title: '删除记录',
        render: () => '确认删除 \n' + record.feedTimeStr + ' 的记录吗？',
        onConfirm: async () => {
          await apiDeleteFeedRecord(record.id)
          emit('deleted', record)
        }
      })
    }

    const renderContent = () => {
      const record = props.data
      if ('feedType' in record) {
        const feedType = record.feedType
        const strategy = feedTypeStrategy[feedType]
        return (
          <div
            class={['feed-record-item', 'record-item-' + feedType]}
            //@ts-ignore
            onLongpress={() => onDeleteRecord(record)}
            onClick={() => onRecordsItemClick(record)}
          >
            <div class='record-item-time'>{record.feedTimeStr}</div>
            {strategy?.render(record.content, record.remark)}
          </div>
        )
      }
      return (
        <div class='feed-record-summary'>
          <span class='record-summary-time'>{record.feedTimeStr}</span>
          <div class='feed-record-summary-wrapper '>
            {feedTypeList.map((dict, index) => {
              const code = dict.code as `${EnumFeedType}`
              const summary = record[code]
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
                  {!!summary.content.duration && (
                    <>
                      <span class='ml-[5px]'>(总时长: </span>
                      <span class='content-number'>
                        {durationFormatNoZero(summary.content.duration, {
                          unit: 's',
                          format: 'H小时m分钟s秒'
                        })}
                      </span>
                      )
                    </>
                  )}
                  {[
                    EnumFeedType.MILK_BOTTLE,
                    EnumFeedType.BREAST_FEED_DIRECT,
                    EnumFeedType.HEIGHT_WEIGHT,
                    EnumFeedType.DIAPER
                  ].includes(summary.label) && (
                    <Tag
                      size='small'
                      class='ml-[5px]'
                      onClick={() => {
                        navigateTo({
                          path: '/pages/sub-summary/chart/index',
                          query: {
                            feedType: code
                          }
                        })
                      }}
                    >
                      分析
                    </Tag>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )
    }

    return () => <> {renderContent()}</>
  }
})
</script>
<style lang="scss">
@import './index.scss';
</style>
