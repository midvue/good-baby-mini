<script lang="tsx">
import { navigateBack, useRoute } from '@/use'
import { Button, FooterBar, Form, type FormInstance, Input, Navbar } from '@mid-vue/taro-h5-ui'
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

    const cells = [
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
            component: () => <Input v-model={state.form.feedTime} placeholder='请输入'></Input>
          },
          {
            label: '喂养类型',
            field: 'feedType',
            component: () => <Input v-model={state.form.milk.type} placeholder='请输入'></Input>
          },
          {
            label: '喂养容量',
            field: 'amount',
            component: () => <Input v-model={state.form.milk.amount} placeholder='请输入'></Input>
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
            attrs: { required: true, border: true },
            component: () => <Input v-model={state.form.remark} placeholder='请输入'></Input>
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
