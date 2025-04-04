<script lang="tsx">
import { EnumFeedType } from '@/dict'
import { navigateBack, useRoute } from '@/use'
import { getBabyInfo } from '@/utils'
import { dateFormat } from '@mid-vue/shared'
import {
  Button,
  DateTimePicker,
  FooterBar,
  Form,
  Input,
  Navbar,
  Textarea,
  type FormInstance,
  type IFormItem
} from '@mid-vue/taro-h5-ui'
import Taro from '@tarojs/taro'
import { defineComponent, reactive, ref } from 'vue'
import { apiAddFeedRecord, apiUpdateFeedRecord } from './api'
import { IHeightWeightState } from './types'
export default defineComponent({
  name: 'HeightWeight',
  setup() {
    const { query } = useRoute<IFeedRecord<IHeightWeight>>()
    let babyInfo = getBabyInfo()

    let defaultHeightWeight = {
      feedType: EnumFeedType.HEIGHT_WEIGHT,
      remark: '',
      babyId: babyInfo.id,
      content: {
        feedTime: dateFormat(Date.now(), 'YYYY-MM-DD HH:mm'),
        height: 50,
        weight: 5,
        headCircumference: undefined,
        footLength: undefined
      } as IHeightWeight
    }
    console.log(query, 22)

    const state = reactive<IHeightWeightState>({
      form: { ...defaultHeightWeight, ...query }
    })

    const formRef = ref<FormInstance>()

    const cells: IFormItem<IHeightWeight>[] = [
      {
        attrs: {
          class: 'form-item-card'
        },
        children: [
          {
            label: '记录时间',
            attrs: { required: true, border: true },
            component: () => <DateTimePicker v-model={state.form.content.feedTime}></DateTimePicker>
          },
          {
            label: '体重',
            field: 'weight',
            attrs: { required: true },
            component: () => (
              <Input v-model={state.form.content.weight} placeholder='请输入体重'></Input>
            ),
            slots: { append: () => 'kg' }
          },
          {
            label: '身高',
            field: 'height',
            attrs: { required: true, border: true },
            component: () => (
              <Input v-model={state.form.content.height} placeholder='请输入身高'></Input>
            ),
            slots: { append: () => 'cm' }
          }
        ]
      },
      {
        attrs: {
          class: 'form-item-card'
        },
        children: [
          {
            label: '头围',
            field: 'headCircumference',
            attrs: { required: false, border: true },
            component: () => (
              <Input
                v-model={state.form.content.headCircumference}
                placeholder='(可选) 请输入头围'
              ></Input>
            ),
            slots: { append: () => 'cm' }
          },
          {
            label: '脚长',
            field: 'footLength',
            attrs: { required: false },
            component: () => (
              <Input
                v-model={state.form.content.footLength}
                placeholder='(可选) 请输入脚长'
              ></Input>
            ),
            slots: { append: () => 'cm' }
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
            component: () => (
              <Textarea v-model={state.form.remark} placeholder='(可选) 请输入备注'></Textarea>
            )
          }
        ]
      }
    ]
    const onSubmit = async () => {
      let apiFunc = state.form.id ? apiUpdateFeedRecord : apiAddFeedRecord
      const res = await apiFunc({ ...state.form, feedTime: state.form.content.feedTime }).catch(
        () => false
      )
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
