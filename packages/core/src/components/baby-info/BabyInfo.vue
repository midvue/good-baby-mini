<script lang="tsx">
import { useDictList } from '@/use'
import {
  Button,
  FooterBar,
  Form,
  type FormInstance,
  IFormItem,
  Input,
  Picker
} from '@mid-vue/taro-h5-ui'
import Taro from '@tarojs/taro'
import { defineComponent, PropType, reactive, ref } from 'vue'
import { apiBabyCreate, apiBabyUpdate } from './api'
import { IBaby } from './types'

export default defineComponent({
  name: 'BabyInfo',
  props: {
    data: {
      type: Object as PropType<IBaby>
    }
  },
  emits: ['close'],
  setup(props, { emit }) {
    const currState = reactive({
      form: { ...props.data } as IBaby
    })

    const formRef = ref<FormInstance>()
    let genderList = useDictList('GENDER')

    const cells: IFormItem<IBaby>[] = [
      {
        attrs: {
          class: 'form-item-card'
        },
        children: [
          //多层级嵌套
          {
            label: '昵称',
            field: 'nickname',
            attrs: { required: true, border: true },
            component: () => (
              <Input v-model={currState.form.nickname} placeholder='请输入宝宝名字'></Input>
            )
          },
          {
            label: '出生日期',
            field: 'birthDate',
            attrs: { required: true, border: true },
            component: () => <Picker v-model={currState.form.birthDate} mode='date'></Picker>
          },
          {
            label: '出生时间',
            field: 'birthTime',
            attrs: { required: false, border: true },
            component: () => <Picker v-model={currState.form.birthTime} mode='time'></Picker>
          },
          {
            label: '性别',
            field: 'gender',
            attrs: { required: true },
            component: () => <Picker v-model={currState.form.gender} range={genderList}></Picker>
          }
        ]
      }
    ]
    const onSubmit = async () => {
      let apiFunc = currState.form.id ? apiBabyUpdate : apiBabyCreate
      const res = await apiFunc(currState.form).catch(() => false)
      if (!res) return
      Taro.showToast({ title: '操作成功' })
      emit('close')
    }

    return () => {
      return (
        <div class='md-baby-info'>
          <Form ref={formRef} cells={cells} v-model={currState.form}></Form>
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
