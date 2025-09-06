<script lang="tsx">
import { defineComponent, type PropType, reactive, ref } from 'vue'
import Taro from '@tarojs/taro'
import { useDate } from '@mid-vue/shared'
import {
  Button,
  FooterBar,
  Form,
  type FormInstance,
  type IFormItem,
  Input,
  Picker
} from '@mid-vue/taro-h5-ui'

import { useDictList } from '@/use'
import { getBabyInfo } from '@/utils'
import { apiPacketCreate, apiPacketUpdate } from './api'
import { type IPacketForm } from './types'

export default defineComponent({
  name: 'PacketForm',
  props: {
    data: {
      type: Object as PropType<IPacketForm>,
      default: () => ({})
    }
  },
  emits: ['close'],
  setup(props, { emit }) {
    const currState = reactive({
      form: {
        ...props.data,
        recordTime: props.data.recordTime ? useDate(props.data.recordTime).format('YYYY-MM-DD') : ''
      } as IPacketForm
    })

    const formRef = ref<FormInstance>()

    const typeList = useDictList('PACKET_TYPE')
    const callNameList = useDictList('FAMILY_CALL')

    const cells: IFormItem<IPacketForm>[] = [
      {
        attrs: {
          class: 'form-item-card'
        },
        children: [
          //多层级嵌套
          {
            label: '称呼',
            field: 'name',
            attrs: { required: true, border: true },
            rules: [{ required: true, message: '请输入称呼' }],
            component: () => <Input v-model={currState.form.name} placeholder='请输入称呼'></Input>
          },
          {
            label: '关系',
            field: 'callName',
            attrs: { required: true, border: true },
            rules: [{ required: true, message: '请选择关系' }],
            component: () => (
              <Picker
                v-model={currState.form.callName}
                range={callNameList}
                mode='selector'
              ></Picker>
            )
          },
          {
            label: '红包类型',
            field: 'type',
            attrs: { required: true, border: true },
            rules: [{ required: true, message: '请选择红包类型' }],
            component: () => (
              <Picker v-model={currState.form.type} range={typeList} mode='selector'></Picker>
            )
          },
          {
            label: '金额',
            field: 'amount',
            attrs: { required: true, border: true },
            rules: [{ required: true, message: '请输入金额' }],
            component: () => (
              <Input v-model={currState.form.amount} placeholder='请输入金额' type='number'></Input>
            )
          },
          {
            label: '记录日期',
            field: 'recordTime',
            attrs: { required: true, border: true },
            rules: [{ required: true, message: '请输入记录日期' }],
            component: () => (
              <Picker
                v-model={currState.form.recordTime}
                mode='date'
                end={useDate().format('YYYY-MM-DD')}
              ></Picker>
            )
          }
        ]
      }
    ]
    const onSubmit = async () => {
      const apiFunc = currState.form.id ? apiPacketUpdate : apiPacketCreate
      const summitData = {
        ...currState.form,
        babyId: getBabyInfo().id
      }
      const res = await apiFunc(summitData).catch(() => false)
      if (!res) return
      Taro.showToast({ title: '操作成功' })
      emit('close')
    }

    return () => {
      return (
        <div class='packet-form'>
          <Form ref={formRef} cells={cells} v-model={currState.form}></Form>
          <FooterBar>
            {/* {props.data?.id && (
              <Button
                type='danger'
                size='mini'
                round
                onClick={async () => {
                  const res = await apiPacketDelete({ id: props.data.id }).catch(() => false)
                  if (!res) return
                  Taro.showToast({ title: '删除成功' })
                  emit('close')
                }}
              >
                删除
              </Button>
            )} */}
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
