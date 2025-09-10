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
  Picker,
  Tag
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
    },
    babyList: {
      type: Array as PropType<{ name: string; code: string }[]>,
      default: () => []
    }
  },
  emits: ['close'],
  setup(props, { emit }) {
    const typeList = useDictList('PACKET_TYPE')
    const callNameList = useDictList('FAMILY_CALL')
    const currState = reactive({
      form: {
        babyId: getBabyInfo().id || '',
        ...props.data,
        recordTime: props.data.recordTime
          ? useDate(props.data.recordTime).format('YYYY-MM-DD')
          : useDate().format('YYYY-MM-DD'),
        type: props.data.type || typeList[typeList.length - 1].code,
        callName: props.data.callName || callNameList[callNameList.length - 1].code
      } as IPacketForm
    })

    const formRef = ref<FormInstance>()

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
            component: () => (
              <Input maxLength='10' v-model={currState.form.name} placeholder='请输入称呼'></Input>
            )
          },
          {
            label: '金额',
            field: 'amount',

            attrs: { required: true, border: true },
            rules: [{ required: true, message: '请输入金额' }],
            component: () => (
              <Input
                maxLength='12'
                v-model={currState.form.amount}
                placeholder='请输入金额'
                type='number'
              ></Input>
            )
          },
          // 关系选择器替换为Tag标签组
          {
            label: '关系',
            field: 'callName',
            attrs: { required: true, border: true },
            rules: [{ required: true, message: '请选择关系' }],
            component: () => (
              <div class='tag-group'>
                {callNameList.map((item) => (
                  <Tag
                    key={item.code}
                    size='medium'
                    type={currState.form.callName === item.code ? 'primary' : 'default'}
                    plain={currState.form.callName !== item.code}
                    onClick={() => (currState.form.callName = item.code)}
                    class='packet-tag-item'
                  >
                    {item.name}
                  </Tag>
                ))}
              </div>
            )
          },
          // 红包类型选择器替换为Tag标签组
          {
            label: '红包类型',
            field: 'type',
            attrs: { required: true, border: true },
            rules: [{ required: true, message: '请选择红包类型' }],
            component: () => (
              <div class='tag-group'>
                {typeList.map((item) => (
                  <Tag
                    key={item.code}
                    size='medium'
                    type={currState.form.type === item.code ? 'primary' : 'default'}
                    plain={currState.form.type !== item.code}
                    onClick={() => (currState.form.type = item.code)}
                    class='packet-tag-item'
                  >
                    {item.name}
                  </Tag>
                ))}
              </div>
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
          },
          {
            label: '关联宝宝',
            field: 'babyId',
            attrs: { required: true, border: true },
            rules: [{ required: true, message: '请选择宝宝' }],
            component: () => (
              <Picker
                v-model={currState.form.babyId}
                range={props.babyList}
                mode='selector'
              ></Picker>
            )
          }
        ]
      }
    ]
    const onSubmit = async () => {
      if (!currState.form.name) {
        Taro.showToast({ title: '请输入称呼', icon: 'none' })
        return
      }
      if (!currState.form.amount || isNaN(currState.form.amount) || currState.form.amount <= 0) {
        Taro.showToast({ title: '请输入正确的金额', icon: 'none' })
        return
      }
      // 添加表单验证
      if (!formRef.value) return
      const apiFunc = currState.form.id ? apiPacketUpdate : apiPacketCreate
      const summitData = {
        ...currState.form,
        familyId: currState.form.babyId ? getBabyInfo().familyId : ''
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
