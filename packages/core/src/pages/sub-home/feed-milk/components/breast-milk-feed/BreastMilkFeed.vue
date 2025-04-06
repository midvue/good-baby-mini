<script lang="tsx">
import { EnumFeedType } from '@/dict'
import { navigateBack } from '@/use'
import { getBabyInfo } from '@/utils'
import { dateFormat, durationFormat, durationFormatNoZero } from '@mid-vue/shared'
import {
  Button,
  DateTimePicker,
  FooterBar,
  Form,
  FormInstance,
  IFormItem,
  Image
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
                  format: 'm分种s秒',
                  unit: 's'
                })}
              </span>
            )
          },
          {
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
      const res = await apiFunc({ ...state.form, feedTime: state.form.content.feedTime }).catch(
        () => false
      )
      if (!res) return
      Taro.showToast({ title: '添加成功' })
      navigateBack()
    }

    return () => (
      <>
        <Form class='breast-milk-feed' ref={formRef} cells={cells} v-model={state.form}></Form>
        <FooterBar>
          <Button type='primary' size='large' round onClick={onSubmit}>
            保存
          </Button>
        </FooterBar>
      </>
    )
  }
})
</script>
<style lang="scss">
@import './index.scss';
</style>
