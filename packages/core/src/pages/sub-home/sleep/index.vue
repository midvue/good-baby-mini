<script lang="tsx">
import { defineComponent, reactive, ref, onUnmounted, watch } from 'vue'
import Taro from '@tarojs/taro'
import { dateDiff, dateFormat, durationFormatNoZero, EnumYesNoPlus } from '@mid-vue/shared'
import {
  Button,
  DateTimePicker,
  Drag,
  FooterBar,
  Form,
  type FormInstance,
  type IFormItem,
  Navbar,
  Textarea
} from '@mid-vue/taro-h5-ui'
import { useRoute, navigateBack, useDictList } from '@/use'
import { EnumFeedType } from '@/dict'
import { FEED_RECORD, getBabyInfo, setStorage } from '@/utils'
import { apiAddFeedRecord, apiUpdateFeedRecord } from './api'

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
        feedTime: dateFormat(Date.now(), 'YYYY-MM-DD HH:mm'),
        duration: 0,
        endTime: dateFormat(Date.now(), 'YYYY-MM-DD HH:mm'),
        quality: '10',
        sleepType: '10'
      } as ISleep
    }
    const state = reactive({
      isManual: !!query.id, //是否手动录入
      isStart: false,
      isRightStat: false,
      form: { ...defaultSleep, ...query } as IFeedRecord<ISleep>,
      timer: null as ReturnType<typeof setInterval> | null
    })
    const sleepTypeList = useDictList('SLEEP_TYPE')
    const qualityList = useDictList('SLEEP_QUALITY')
    let timer: NodeJS.Timeout

    /** 点击计时 */
    const onClick = () => {
      if (timer) {
        clearInterval(timer)
      }
      state.isStart = !state.isStart
      if (!state.isStart) return
      timer = setInterval(() => {
        state.form.content.duration++
      }, 1000)
    }

    const onClickDrag = () => {
      clearInterval(timer)
      state.isManual = !state.isManual
      state.isStart = false
    }
    const onSubmit = async () => {
      if (state.form.content.duration === 0) {
        Taro.showToast({
          title: '睡眠时长不能为0哦!',
          icon: 'none'
        })
        return
      }
      if (state.isStart) {
        Taro.showToast({
          title: '请先结束计时',
          icon: 'none'
        })
        return
      }
      // 若不是手动录入，计算 endTime
      if (!state.isManual) {
        const feedTime = new Date(state.form.content.feedTime)
        // 将 duration 转换为毫秒后加到 feedTime 上
        const endTime = new Date(feedTime.getTime() + state.form.content.duration * 1000)
        state.form.content.endTime = dateFormat(endTime, 'YYYY-MM-DD HH:mm')
      }
      const apiFunc = state.form.id ? apiUpdateFeedRecord : apiAddFeedRecord
      const record = { ...state.form, feedTime: state.form.content.feedTime }
      const res = await apiFunc(record).catch(() => false)
      if (!res) return
      setStorage(FEED_RECORD + record.feedType, record)
      Taro.showToast({ title: '添加成功' })
      navigateBack()
    }

    onUnmounted(() => {
      clearInterval(timer)
    })

    watch(
      () => [state.form.content.feedTime, state.form.content.endTime],
      () => {
        if (state.isManual) {
          state.form.content.duration =
            dateDiff(state.form.content.endTime, state.form.content.feedTime) / 1000
          console.log('duration', state.form.content.duration)
        }
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
            attrs: { required: true, border: true },
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
                <div class='sleep-record'>
                  <div class='sleep-item'>
                    <div class={'sleep-time }'} onClick={onClick}>
                      {state.isStart ? '结束计时' : '开始计时'}
                    </div>
                  </div>
                </div>
              )
            }
          },
          {
            label: '入睡方式',
            field: 'sleepType',
            attrs: {
              labelAlign: 'top',
              class: 'pb-[10px]'
            },
            component: () => (
              <div class='grid grid-cols-3 gap-10 size-full'>
                {sleepTypeList.map((item) => (
                  <div
                    class={{ 'tag-item': true, active: state.form.content.sleepType === item.code }}
                    onClick={() => (state.form.content.sleepType = item.code)}
                  >
                    {item.name}
                  </div>
                ))}
              </div>
            )
          },
          {
            label: '睡眠质量',
            field: 'quality',
            attrs: {
              labelAlign: 'top',
              class: 'pb-[10px]'
            },
            component: () => (
              <div class='grid grid-cols-3 gap-10 size-full'>
                {qualityList.map((item) => (
                  <div
                    class={{ 'tag-item': true, active: state.form.content.quality === item.code }}
                    onClick={() => (state.form.content.quality = item.code)}
                  >
                    {item.name}
                  </div>
                ))}
              </div>
            )
          }
        ]
      },
      {
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
    ]

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
          <div class='sleep-header'>
            <div class='sleep-record'>
              <Form ref={formRef} cells={cells} v-model={state.form}></Form>
              <FooterBar>
                <Button type='primary' size='large' round onClick={onSubmit}>
                  保存
                </Button>
              </FooterBar>
              <Drag gap={{ x: 1, y: 80 }} offset={{ x: -1, y: 430 }}>
                <div class='sleep-drag-content' onClick={onClickDrag}>
                  <span>{state.isManual ? '自动计时' : '手动输入'}</span>
                </div>
              </Drag>
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
