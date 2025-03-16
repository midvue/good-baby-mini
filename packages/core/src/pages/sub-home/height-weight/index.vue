<script lang="tsx">
import { navigateBack, useRoute } from '@/use'
import { getBabyInfo } from '@/utils'
import { dateFormat } from '@mid-vue/shared'
import {
  Button,
  DateTimePicker,
  FooterBar,
  Form,
  Navbar,
  Picker,
  Textarea,
  type FormInstance,
  type IFormItem
} from '@mid-vue/taro-h5-ui'
import { defineCtxState } from '@mid-vue/use'
import Taro from '@tarojs/taro'
import { defineComponent, ref } from 'vue'
import { apiAddFeedRecord } from './api'
import { IHeightWeightState } from './types'
export default defineComponent({
  name: 'HeightWeight',
  setup() {
    const { query } = useRoute<{ feedType: number }>()
    const [state] = defineCtxState<IHeightWeightState>({
      feedType: query.feedType,
      remark: '',
      form: {
        feedTime: dateFormat(Date.now(), 'YYYY-MM-DD HH:mm'),
        height: 50,
        weight: 50,
        headCircumference: 60,
        footLength: 70
      } as IHeightWeight
    })

    const formRef = ref<FormInstance>()

    function initHeightList() {
      const min = 50
      const max = 140
      let curr = min
      const heightList = []
      while (curr < max) {
        heightList.push({ code: curr, name: curr + 'cm' })
        curr += 1
      }
      return heightList
    }
    const heightList = initHeightList()

    function initWeightList() {
      const min = 2
      const max = 20
      let curr = min
      const heightList = []
      while (curr < max) {
        heightList.push({ code: curr, name: curr + 'kg' })
        curr += 0.25
      }
      return heightList
    }
    const weightList = initWeightList()

    const cells: IFormItem<IHeightWeightState['form']>[] = [
      {
        attrs: {
          class: 'form-item-card'
        },
        children: [
          {
            label: '记录时间',
            component: () => <DateTimePicker v-model={state.form.feedTime}></DateTimePicker>
          },
          {
            label: '身高',
            field: 'height',
            attrs: { required: true, border: true },
            component: () => <Picker v-model={state.form.height} range={heightList}></Picker>
          },
          {
            label: '体重',
            field: 'weight',
            attrs: { required: true, border: true },
            component: () => <Picker v-model={state.form.weight} range={weightList}></Picker>
          },
          {
            label: '头围',
            field: 'headCircumference',
            attrs: { required: true, border: true },
            component: () => (
              <Picker v-model={state.form.headCircumference} range={heightList}></Picker>
            )
          },
          {
            label: '脚长',
            field: 'footLength',
            attrs: { required: true },
            component: () => <Picker v-model={state.form.footLength} range={heightList}></Picker>
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
            component: () => <Textarea v-model={state.remark} placeholder='请输入'></Textarea>
          }
        ]
      }
    ]
    const onSubmit = async () => {
      const res = await apiAddFeedRecord({
        babyId: getBabyInfo().id,
        feedType: state.feedType,
        remark: state.remark,
        feedTime: state.form.feedTime,
        content: state.form
      }).catch(() => false)
      if (!res) return
      Taro.showToast({ title: '添加成功' })
      navigateBack()
    }

    return () => {
      return (
        <div class='height-weight'>
          <Navbar
            title='身高体重记录'
            defaultConfig={{
              frontColor: '#000000',
              backgroundColor: 'fff8e5'
            }}
          ></Navbar>
          <Form class='height-weight-form' ref={formRef} cells={cells} v-model={state.form}></Form>
          <FooterBar>
            <Button type='primary' size='large' round onClick={onSubmit}>
              保存
            </Button>
          </FooterBar>
        </div>
      )
    }
  }
})
</script>
<style lang="scss">
@import './index.scss';
</style>
