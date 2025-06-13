<script lang="tsx">
import { defineComponent, ref, reactive } from 'vue'
import Taro from '@tarojs/taro'
import {
  Navbar,
  Image,
  Button,
  FooterBar,
  Form,
  type FormInstance,
  type IFormItem,
  Input,
  Tag
} from '@mid-vue/taro-h5-ui'
import { useDictList } from '@/use'
import imgBabyAvatar from '@/assets/images/img_baby_avatar.png'
import { getUserInfo } from '@/utils'
import { useAppStore } from '@/stores'
import { type IUser } from './types'
import { apiUserUpdate } from './api'

export default defineComponent({
  name: 'EditMe',
  emits: ['close'],
  setup() {
    const formRef = ref<FormInstance>()
    const userInfo = getUserInfo()
    const appStore = useAppStore()
    const currState = reactive({
      form: {
        ...userInfo
      } as IUser
    })

    const genderList = useDictList('GENDER')

    const cells: IFormItem<IUser>[] = [
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
            rules: [{ required: true, message: '请输入昵称' }],
            component: () => (
              <Input v-model={currState.form.nickname} placeholder='请输入昵称'></Input>
            )
          },
          {
            label: '性别',
            field: 'gender',
            attrs: { required: true, border: true },
            rules: [{ required: true, message: '请选择性别' }],
            component: () => {
              return (
                <>
                  {genderList.map((gender) => {
                    return (
                      <Tag
                        class='w-[60px] mr-[8px]'
                        round
                        type='primary'
                        plain={currState.form.gender !== gender.code}
                        onClick={() => {
                          currState.form.gender = gender.code
                        }}
                      >
                        {gender.name}
                      </Tag>
                    )
                  })}
                </>
              )
            }
          },
          {
            label: '手机号',
            field: 'phone',
            attrs: { required: true, border: true },
            rules: [{ required: true, message: '请输入手机号' }],
            component: () => (
              <Input v-model={currState.form.phone} placeholder='请输入手机号'></Input>
            )
          }
        ]
      }
    ]
    const onSubmit = async () => {
      const res = await apiUserUpdate(currState.form).catch(() => false)
      if (!res) return
      appStore.updateUseInfo()
      Taro.showToast({ title: '更新成功!' })
      setTimeout(() => {
        Taro.navigateBack()
      }, 50)
    }
    return () => {
      return (
        <div class='edit-me'>
          <Navbar
            title='个人信息编辑'
            autoTheme
            defaultConfig={{
              frontColor: '#000000',
              backgroundColor: '#F7F7F7s'
            }}
          ></Navbar>
          <Image class='edit-avatar' src={imgBabyAvatar}></Image>
          <div class='edit-form'>
            <Form ref={formRef} cells={cells} v-model={currState.form}></Form>
            <FooterBar clearfix={false}>
              <Button type='primary' size='large' round onClick={onSubmit}>
                保存
              </Button>
            </FooterBar>
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
