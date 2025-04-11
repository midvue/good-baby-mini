<script lang="tsx">
import { EnumFeedType } from '@/dict'
import { navigateBack } from '@/use'
import { FEED_RECORD, getBabyInfo, setStorage } from '@/utils'
import { dateFormat, durationFormat, durationFormatNoZero, useNumber } from '@mid-vue/shared'
import {
  Button,
  DateTimePicker,
  Drag,
  FooterBar,
  Form,
  FormInstance,
  IFormItem,
  Image,
  Input,
  Textarea
} from '@mid-vue/taro-h5-ui'
import Taro from '@tarojs/taro'
import { defineComponent, onUnmounted, PropType, reactive, ref, watch } from 'vue'
import { apiAddFeedRecord, apiUpdateFeedRecord } from './api'
import imgMilkEnd from './assets/img_milk_end.png'
import imgMilkStart from './assets/img_milk_start.png'

export default defineComponent({
  name: 'BreastMilkFeed',
  props: {
    data: {
      type: Object as PropType<IFeedRecord<IBreastMilk>>
    }
  },
  emits: ['close'],
  setup(props) {
    /** 奶瓶喂养 */
    let babyInfo = getBabyInfo()
    let defaultMilk = {
      feedType: EnumFeedType.BREAST_FEED_DIRECT,
      remark: '',
      babyId: babyInfo.id,
      content: {
        duration: 0,
        leftDuration: 0,
        rightDuration: 0,
        feedTime: dateFormat(Date.now(), 'YYYY-MM-DD HH:mm')
      } as IBreastMilk
    }

    const state = reactive({
      isManual: !!props.data?.id, //是否手动录入
      isLeftStart: false,
      isRightStat: false,
      form: { ...defaultMilk, ...props.data } as IFeedRecord<IBreastMilk>
    })

    watch(
      () => [state.form.content.leftDuration, state.form.content.rightDuration],
      () => {
        state.form.content.duration =
          (state.form.content.leftDuration || 0) + (state.form.content.rightDuration || 0)
      }
    )

    let formatDuration = (duration: number = 0) => {
      if (!duration) return '00:00'
      return durationFormat(duration, { format: 'mm:ss', unit: 's' })
    }

    const formRef = ref<FormInstance>()

    let timer: NodeJS.Timeout
    /** 点击左边 */
    let onLeftClick = () => {
      if (timer) {
        clearInterval(timer)
      }
      state.isLeftStart = !state.isLeftStart
      state.isRightStat = false
      if (!state.isLeftStart) return
      timer = setInterval(() => {
        state.form.content.leftDuration++
      }, 1000)
    }
    /** 点击右边 */
    let onRightClick = () => {
      if (timer) {
        clearInterval(timer)
      }
      state.isRightStat = !state.isRightStat
      state.isLeftStart = false
      if (!state.isRightStat) return
      timer = setInterval(() => {
        state.form.content.rightDuration++
      }, 1000)
    }

    let onClickManual = () => {
      clearInterval(timer)
      state.isRightStat = false
      state.isLeftStart = false
      state.isManual = true
    }

    onUnmounted(() => {
      clearInterval(timer)
    })

    const cells: IFormItem<IBreastMilk>[] = [
      {
        attrs: {
          class: 'form-item-card'
        },
        children: [
          {
            label: '开始时间',
            field: 'feedTime',
            attrs: { required: true, border: true },
            component: () => <DateTimePicker v-model={state.form.content.feedTime}></DateTimePicker>
          },
          {
            label: '总时长',
            field: 'duration',
            attrs: { required: true, border: true },
            component: () => (
              <span>
                {durationFormatNoZero(state.form.content.duration, {
                  format: 'm分钟s秒',
                  unit: 's'
                })}
              </span>
            )
          },
          {
            label: '左侧时长',
            field: 'leftDuration',
            attrs: { required: true, border: true },
            show: () => state.isManual,
            component: () => {
              let num = useNumber(state.form.content.leftDuration)
              let minute = Number(num.div(60).toFixed(0, 0))
              let second = num.mod(60).toNumber()
              return (
                <div class='flex items-center'>
                  <Input
                    modelValue={minute}
                    append='分'
                    type='number'
                    onInput={(e) => {
                      let value = e.detail.value
                      if (!value) {
                        state.form.content.leftDuration = second
                        return
                      }
                      state.form.content.leftDuration = value * 60 + second
                    }}
                  ></Input>
                  <Input
                    modelValue={second}
                    append='秒'
                    type='number'
                    class='ml-[10px]'
                    onInput={(e) => {
                      let value = e.detail.value
                      state.form.content.leftDuration = minute * 60 + (value || 0)
                    }}
                  ></Input>
                </div>
              )
            }
          },
          {
            label: '右侧时长',
            field: 'rightDuration',
            attrs: { required: true },
            show: () => state.isManual,
            component: () => {
              let num = useNumber(state.form.content.rightDuration)
              let minute = Number(num.div(60).toFixed(0, 0))
              let second = num.mod(60).toNumber()
              return (
                <div class='flex items-center'>
                  <Input
                    modelValue={minute}
                    append='分'
                    type='number'
                    onInput={(e) => {
                      let value = e.detail.value
                      if (!value) {
                        state.form.content.rightDuration = second
                        return
                      }
                      state.form.content.rightDuration = value * 60 + second
                    }}
                  ></Input>
                  <Input
                    modelValue={second}
                    append='秒'
                    type='number'
                    class='ml-[10px]'
                    onInput={(e) => {
                      let value = e.detail.value
                      state.form.content.rightDuration = minute * 60 + (value || 0)
                    }}
                  ></Input>
                </div>
              )
            }
          },

          {
            show: () => !state.isManual,
            render: () => {
              return (
                <div class='breast-milk-player'>
                  <div class='milk-player-item'>
                    <div class='milk-player-time'>
                      {formatDuration(state.form.content.leftDuration)}
                    </div>
                    <Image
                      src={state.isLeftStart ? imgMilkEnd : imgMilkStart}
                      class='player-img'
                      onClick={onLeftClick}
                    ></Image>
                    <span class='player-label'>左边</span>
                  </div>
                  <div class='milk-player-item'>
                    <div class='milk-player-time'>
                      {formatDuration(state.form.content.rightDuration)}
                    </div>
                    <Image
                      src={state.isRightStat ? imgMilkEnd : imgMilkStart}
                      class='player-img'
                      onClick={onRightClick}
                    ></Image>
                    <span class='player-label'>右边</span>
                  </div>
                </div>
              )
            }
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
    const onSubmit = async () => {
      if (state.isLeftStart || state.isRightStat) {
        Taro.showToast({
          title: '请先结束喂养计时',
          icon: 'none'
        })
        return
      }

      let apiFunc = state.form.id ? apiUpdateFeedRecord : apiAddFeedRecord
      let record = { ...state.form, feedTime: state.form.content.feedTime }
      const res = await apiFunc(record).catch(() => false)
      if (!res) return
      setStorage(FEED_RECORD + record.feedType, record)
      Taro.showToast({ title: '添加成功' })
      navigateBack()
    }

    return () => (
      <div class='breast-milk-feed'>
        <Form ref={formRef} cells={cells} v-model={state.form}></Form>
        <FooterBar>
          <Button type='primary' size='large' round onClick={onSubmit}>
            保存
          </Button>
        </FooterBar>
        <Drag gap={{ x: 1, y: 80 }} offset={{ x: -1, y: 430 }}>
          <div class='breast-drag-content' onClick={onClickManual}>
            <span>手动输入</span>
          </div>
        </Drag>
      </div>
    )
  }
})
</script>
<style lang="scss">
@import './index.scss';
</style>
