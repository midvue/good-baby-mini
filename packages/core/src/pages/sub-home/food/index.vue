<script lang="tsx">
import { defineComponent, reactive, ref } from 'vue'
import Taro from '@tarojs/taro'
import { dateFormat } from '@mid-vue/shared'
import {
  Button,
  DateTimePicker,
  FooterBar,
  Form,
  type FormInstance,
  type IFormItem,
  Input,
  Navbar,
  Picker,
  Textarea
} from '@mid-vue/taro-h5-ui'
import { useRoute, navigateBack, useDictList } from '@/use'
import { EnumFeedType } from '@/dict'
import { getBabyInfo } from '@/utils'
import { apiAddFeedRecord, apiUpdateFeedRecord } from './api'

export default defineComponent({
  name: 'Food',
  setup() {
    const { query } = useRoute<IFeedRecord<IFood>>()
    const babyInfo = getBabyInfo()
    const defaultFood = {
      feedType: EnumFeedType.FOOD,
      remark: '',
      babyId: babyInfo.id,
      content: {
        feedTime: dateFormat(Date.now(), 'YYYY-MM-DD HH:mm'),
        duration: '10',
        type: '10',
        shape: '10',
        foodAmount: 1,
        foodAmountUnit: '20',
        feedback: '10'
      } as IFood
    }
    const state = reactive({
      isStart: false,
      isRightStat: false,
      form: { ...defaultFood, ...query } as IFeedRecord<IFood>,
      isTiming: false, // 标记是否正在计时
      elapsedSeconds: 0, // 已过去的秒数
      timer: null as ReturnType<typeof setInterval> | null
    })
    const foodTypeList = useDictList('FOOD_TYPE')
    const shapeList = useDictList('FOOD_SHAPE')
    const unitList = useDictList('FOOD_UNIT')
    const durationList = useDictList('FOOD_DURATION')
    const feedbackList = useDictList('FOOD_FEEDBACK')

    const onSubmit = async () => {
      if (state.isStart) {
        Taro.showToast({
          title: '请先结束喂养计时',
          icon: 'none'
        })
        return
      }

      const apiFunc = state.form.id ? apiUpdateFeedRecord : apiAddFeedRecord
      const record = { ...state.form, feedTime: state.form.content.feedTime }
      const res = await apiFunc(record).catch(() => false)
      if (!res) return
      Taro.showToast({ title: '添加成功' })
      navigateBack()
    }

    const cells: IFormItem<IFood>[] = [
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
            label: '辅食类型',
            field: 'type',
            attrs: {
              labelAlign: 'top',
              class: 'pb-[10px]'
            },
            component: () => (
              <div class='grid grid-cols-4 gap-10 size-full'>
                {foodTypeList.map((item) => (
                  <div
                    class={{ 'tag-item': true, active: state.form.content.type === item.code }}
                    onClick={() => (state.form.content.type = item.code)}
                  >
                    {item.name}
                  </div>
                ))}
              </div>
            )
          },
          {
            label: '辅食形状',
            field: 'shape',
            attrs: {
              labelAlign: 'top',
              class: 'pb-[10px]'
            },
            component: () => (
              <div class='grid grid-cols-3 gap-10 size-full'>
                {shapeList.map((item) => (
                  <div
                    class={{ 'tag-item': true, active: state.form.content.shape === item.code }}
                    onClick={() => (state.form.content.shape = item.code)}
                  >
                    {item.name}
                  </div>
                ))}
              </div>
            )
          },
          {
            label: '食量',
            field: 'foodAmount',
            attrs: { required: true, border: true },
            component: () => <Input v-model={state.form.content.foodAmount} type='number'></Input>
          },
          {
            label: '食量单位',
            field: 'foodAmountUnit',
            attrs: { required: true, border: true },
            component: () => (
              <Picker
                v-model={state.form.content.foodAmountUnit}
                range={unitList}
                mode='selector'
              ></Picker>
            )
          },
          {
            label: '持续时长',
            field: 'duration',
            attrs: { required: true, border: true },
            component: () => (
              <Picker
                v-model={state.form.content.duration}
                range={durationList}
                mode='selector'
              ></Picker>
            )
          },
          {
            label: '宝宝反馈',
            field: 'feedback',
            attrs: {
              labelAlign: 'top',
              class: 'pb-[10px]'
            },
            component: () => (
              <div class='grid grid-cols-4 gap-10 size-full'>
                {feedbackList.map((item) => (
                  <div
                    class={{ 'tag-item': true, active: state.form.content.feedback === item.code }}
                    onClick={() => (state.form.content.feedback = item.code)}
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
              labelAlign: 'top',
              class: 'pb-[10px]'
            },
            component: () => <Textarea v-model={state.form.remark} placeholder='请输入'></Textarea>
          }
        ]
      }
    ]

    const formRef = ref<FormInstance>()

    return () => {
      return (
        <div class='food'>
          <Navbar
            title='辅食'
            defaultConfig={{
              frontColor: '#000000',
              backgroundColor: 'transparent'
            }}
          ></Navbar>
          <div class='food-header'>
            <div class='food-record'>
              <Form class='food-form' ref={formRef} cells={cells} v-model={state.form}></Form>
              <FooterBar>
                <Button type='primary' size='large' round onClick={onSubmit}>
                  保存
                </Button>
              </FooterBar>
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
