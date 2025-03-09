import { Form, FormInstance, Icon, IFormItem, Input } from '@mid-vue/taro-h5-ui'
import { ref } from 'vue'
import { IMineState } from '../types'

/** 菜单列表 */
export let useList = () => {
  const formRef = ref<FormInstance>()

  function renderItem(label: string) {
    return (
      <div class='mine-list-item'>
        <div>
          <Icon class='list-item-icon' name='time'></Icon>
          <span>{label}</span>
        </div>
        <Icon name='arrow'></Icon>
      </div>
    )
  }

  const cells: IFormItem[] = [
    {
      attrs: {
        class: 'form-item-card'
      },
      children: [
        {
          label: () => renderItem('宝宝管理'),
          attrs: { border: true }
        },
        {
          label: () => renderItem('邀请家人'),
          attrs: { border: true }
        },
        {
          label: () => renderItem('老年人模式')
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
          label: () => renderItem('退出登录')
        }
      ]
    }
  ]

  return {
    render: () => {
      return (
        <div class='mine-list'>
          <Form ref={formRef} cells={cells} labelWidth='100%'></Form>
        </div>
      )
    }
  }
}
