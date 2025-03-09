<script lang="tsx">
import { navigateBack, useRoute } from '@/use'
import {
  Button,
  FooterBar,
  Form,
  type FormInstance,
  IFormItem,
  Input,
  Navbar,
  Picker,
  Textarea
} from '@mid-vue/taro-h5-ui'
import { defineCtxState } from '@mid-vue/use'
import Taro from '@tarojs/taro'
import { defineComponent, ref } from 'vue'
import { apiAddFeedRecord } from './api'
import { type IFeedMilkState } from './types'

export default defineComponent({
  name: 'FeedMilk',
  setup() {
    const { query } = useRoute<{ feedType: number }>()
    const [state, setState] = defineCtxState<IFeedMilkState>({
      form: {
        type: query.feedType || 10,
        milk: {}
      } as IFeedMilkState['form']
    })

    const formRef = ref<FormInstance>()

    const cells: IFormItem<IFeedMilkState['form']>[] = [
      {
        attrs: {
          class: 'form-item-card'
        },
        children: [
          //多层级嵌套
          {
            label: '喂养时间',
            field: 'feedTime',
            attrs: { required: true, border: true },
            component: () => <Picker v-model={state.form.feedTime} mode='time'></Picker>
          },
          {
            label: '喂养类型',
            field: 'type',
            attrs: { required: true, border: true },
            component: () => <Input v-model={state.form.milk.type} placeholder='请输入'></Input>
          },
          {
            label: '喂养容量',
            field: 'milk.amount',
            attrs: { required: true },
            component: () => <Picker v-model={state.form.milk.type} mode='time'></Picker>
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
            field: 'remark',
            attrs: {
              labelAlign: 'top'
            },
            component: () => <Textarea v-model={state.form.remark} placeholder='请输入'></Textarea>
          }
        ]
      }
    ]
    const onSubmit = async () => {
      const { milk, ...rest } = state.form
      rest.content = '' + milk.type + milk.amount
      const res = await apiAddFeedRecord(rest).catch(() => false)
      if (!res) return
      Taro.showToast({ title: '添加成功' })
      navigateBack()
    }

    return () => {
      return (
        <div class='feed-milk'>
          <Navbar
            title='首页'
            defaultConfig={{
              frontColor: '#000000',
              backgroundColor: 'transparent'
            }}
          ></Navbar>
          <Form ref={formRef} cells={cells} v-model={state.form}></Form>
          <FooterBar>
            <Button type='warning' size='large' onClick={onSubmit}>
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
