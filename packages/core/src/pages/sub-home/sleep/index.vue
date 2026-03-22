<script lang="tsx">
import { defineComponent, reactive, ref, watch } from 'vue'
import Taro, { useDidShow } from '@tarojs/taro'
import { dateDiff, dateFormat, durationFormatNoZero, EnumYesNoPlus } from '@allkit/shared'
import {
  Button,
  DateTimePicker,
  Drag,
  FooterBar,
  Form,
  type FormInstance,
  type IFormItem,
  Navbar,
  Tag,
  Textarea
} from '@allkit/taro-h5-ui'
import { useRoute, navigateBack, useDictList } from '@/use'
import { EnumFeedType } from '@/dict'
import { clearSleepStartTime, getBabyInfo, getSleepStartTime, setSleepStartTime } from '@/utils'
import { StarRating } from '@/components/star-rating'
import { apiAddFeedRecord, apiGetLatestFeedRecords, apiUpdateFeedRecord } from './api'

export default defineComponent({
  name: 'Sleep',
  setup() {
    const { query } = useRoute<IFeedRecord<ISleep>>()
    const babyInfo = getBabyInfo()
    const defaultSleep = {
      feedType: EnumFeedType.SLEEP,
      remark: '',
      babyId: babyInfo.id,
      content: {
        feedTime: getSleepStartTime()?.feedTime || dateFormat(Date.now(), 'YYYY-MM-DD HH:mm'),
        duration: 0,
        endTime: dateFormat(Date.now(), 'YYYY-MM-DD HH:mm'),
        sleepType: '10',
        starRating: 3
      } as ISleep
    }
    const sleepQualityList = ['很差', '较差', '一般', '较好', '很好']
    const state = reactive({
      isManual: !!query.id || getSleepStartTime()?.feedTime || false, //是否手动录入
      form: {
        ...defaultSleep,
        ...query
      } as IFeedRecord<ISleep>,
      timer: null as ReturnType<typeof setInterval> | null
    })
    const sleepTypeList = useDictList('SLEEP_TYPE')

    /** 点击计时 */
    const onStartClick = () => {
      setSleepStartTime({
        feedTime: state.form.content.feedTime
      })
      Taro.showToast({ title: '保存成功' })
      setTimeout(() => {
        navigateBack()
      }, 1000)
    }
    const onClickDrag = () => {
      state.isManual = !state.isManual
    }
    const onSubmit = async () => {
      if (state.form.content.duration === 0) {
        Taro.showToast({
          title: '睡眠时长不能为0哦!',
          icon: 'none'
        })
        return
      }
      // 若不是手动录入，计算 endTime
      const feedTime = new Date(state.form.content.feedTime)
      // 将 duration 转换为毫秒后加到 feedTime 上
      const endTime = new Date(feedTime.getTime() + state.form.content.duration * 1000)
      state.form.content.endTime = dateFormat(endTime, 'YYYY-MM-DD HH:mm')
      const apiFunc = state.form.id ? apiUpdateFeedRecord : apiAddFeedRecord
      const record = { ...state.form, feedTime: state.form.content.feedTime }
      const res = await apiFunc(record).catch(() => false)
      if (!res) return
      Taro.showToast({ title: '保存成功' })
      !query.id && clearSleepStartTime() // 手动添加成功时，移除 SLEEP_START_TIME
      navigateBack()
    }
    watch(
      () => [state.form.content.feedTime, state.form.content.endTime],
      () => {
        if (state.isManual) {
          state.form.content.duration =
            dateDiff(state.form.content.endTime, state.form.content.feedTime) / 1000
        }
      },
      {
        immediate: true
      }
    )
    /**
     *  监听日期选择的变化，重新渲染图表
     */
    const onDateChange = (type: EnumYesNoPlus) => {
      // 起始不能大于结束时间
      const diffDate = dateDiff(state.form.content.endTime, state.form.content.feedTime)
      if (diffDate < 0) {
        Taro.showToast({ title: '开始时间不能大于结束时间哦!', icon: 'none' })
        if (type === EnumYesNoPlus.YES) {
          state.form.content.feedTime = state.form.content.endTime
        } else {
          state.form.content.endTime = dateFormat(Date.now(), 'YYYY-MM-DD HH:mm')
        }
      }
    }

    useDidShow(() => {
      if (query.id) return
      apiGetLatestFeedRecords({
        babyId: getBabyInfo().id,
        feedTypes: [EnumFeedType.SLEEP]
      }).then((list) => {
        if (!list[0]) return
        state.form.content = {
          ...list[0]?.content,
          feedTime: getSleepStartTime()?.feedTime || dateFormat(Date.now(), 'YYYY-MM-DD HH:mm'),
          endTime: dateFormat(Date.now(), 'YYYY-MM-DD HH:mm')
        }
      })
    })

    const cells: IFormItem<ISleep>[] = [
      {
        attrs: {
          class: 'form-item-card'
        },
        children: [
          {
            label: '开始时间',
            field: 'feedTime',
            attrs: { required: true, border: true },
            component: () => (
              <DateTimePicker
                v-model={state.form.content.feedTime}
                onChange={() => onDateChange(EnumYesNoPlus.YES)}
              ></DateTimePicker>
            )
          },
          {
            label: '结束时间',
            field: 'endTime',
            attrs: { required: true, border: true },
            show: () => state.isManual,
            component: () => (
              <DateTimePicker
                v-model={state.form.content.endTime}
                onChange={() => onDateChange(EnumYesNoPlus.NO)}
              ></DateTimePicker>
            )
          },
          {
            label: '睡眠时长',
            field: 'duration',
            attrs: { border: true },
            show: () => state.isManual,
            component: () => (
              <span>
                {durationFormatNoZero(state.form.content.duration, {
                  format: 'H小时m分钟s秒',
                  unit: 's'
                })}
              </span>
            )
          },
          {
            show: () => !state.isManual,
            render: () => {
              return (
                <div class='mt-[50px] flex justify-center'>
                  <Button type='primary' size='medium' round onClick={onStartClick}>
                    开始记录
                  </Button>
                </div>
              )
            }
          },
          {
            label: '入睡方式',
            field: 'sleepType',
            attrs: {
              class: 'form-item-type',
              border: true
            },
            show: () => state.isManual,
            component: () => (
              <div class='flex flex-wrap mt-[8px]'>
                {sleepTypeList.map((item) => {
                  return (
                    <Tag
                      class=' mr-[8px] mb-[8px]'
                      key={item.code}
                      size='large'
                      type='primary'
                      onClick={() => (state.form.content.sleepType = item.code)}
                      plain={state.form.content.sleepType !== item.code}
                    >
                      {item.name}
                    </Tag>
                  )
                })}
              </div>
            )
          },
          {
            label: '睡眠质量',
            field: 'starRating',
            attrs: {
              labelAlign: 'top',
              class: 'pb-[10px]'
            },
            show: () => state.isManual,
            component: () => (
              <div class='form-item-quality'>
                <StarRating v-model={state.form.content.starRating} size='large' />
                <span class='ml-[16px] text-[#675d78]'>
                  {sleepQualityList[state.form.content.starRating - 1]}
                </span>
              </div>
            )
          }
        ]
      },
      // 类型过滤
      state.isManual && {
        attrs: {
          class: 'form-item-card'
        },
        children: [
          //多层级嵌套
          {
            label: '备注',
            attrs: {
              labelAlign: 'top'
            },
            component: () => <Textarea v-model={state.form.remark} placeholder='请输入'></Textarea>
          }
        ]
      }
    ] as IFormItem<ISleep>[]
    const formRef = ref<FormInstance>()
    return () => {
      return (
        <div class='sleep'>
          <Navbar
            title='睡眠'
            defaultConfig={{
              frontColor: '#000000',
              backgroundColor: 'transparent'
            }}
          ></Navbar>

          <Form ref={formRef} cells={cells} v-model={state.form}></Form>
          {state.isManual && (
            <FooterBar>
              <Button type='primary' size='large' round onClick={onSubmit}>
                保存
              </Button>
            </FooterBar>
          )}
          <Drag gap={{ x: 1, y: 80 }} offset={{ x: -1, y: 430 }}>
            <div class='sleep-drag-content' onClick={onClickDrag}>
              <span>{state.isManual ? '自动计时' : '手动输入'}</span>
            </div>
          </Drag>
        </div>
      )
    }
  }
})
</script>
<style lang="scss">
@import './index.scss';
</style>
