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
import { useAppStore } from '@/stores'
import { useDate } from '@mid-vue/shared'

export default defineComponent({
  name: 'BabyInfo',
  props: {
    data: {
      type: Object as PropType<IBaby>
    }
  },
  emits: ['close'],
  setup(props, { emit }) {
    let appStore = useAppStore()
    const currState = reactive({
      form: { ...props.data, familyId: appStore.familyId } as IBaby
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
            label: '宝宝昵称',
            field: 'nickname',
            attrs: { required: true, border: true },
            rules: [{ required: true, message: '请输入宝宝昵称' }],
            component: () => (
              <Input v-model={currState.form.nickname} placeholder='请输入宝宝昵称'></Input>
            )
          },
          {
            label: '出生日期',
            field: 'birthDate',
            attrs: { required: true, border: true },
            rules: [{ required: true, message: '请输入宝宝出生日期' }],
            component: () => (
              <Picker
                v-model={currState.form.birthDate}
                mode='date'
                end={useDate().format('YYYY-MM-DD')}
              ></Picker>
            )
          },
          {
            label: '出生时间',
            field: 'birthTime',
            attrs: { required: false, border: true },
            component: () => <Picker v-model={currState.form.birthTime} mode='time'></Picker>
          },
          {
            label: '宝宝性别',
            field: 'gender',
            attrs: { required: true },
            rules: [{ required: true, message: '请选择宝宝的性别' }],
            component: () => <Picker v-model={currState.form.gender} range={genderList}></Picker>
          }
        ]
      }
    ]
    const onSubmit = async () => {
      let apiFunc = currState.form.id ? apiBabyUpdate : apiBabyCreate
      const res = await apiFunc(currState.form).catch(() => false)
      if (!res) return
      appStore.updateUseInfo()
      Taro.showToast({ title: '操作成功' })
      emit('close')
    }

    return () => {
      return (
        <div class='md-baby-info'>
          <Form ref={formRef} cells={cells} v-model={currState.form}></Form>
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
