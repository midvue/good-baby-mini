### mid-vue-cell-form 表单组件,主要用于一页多个 cell 的场景

```ts
const formRef = ref<FormInstance>()
const state = reactive({
  form: {
    reasonType: '',
    contacts: ''
  }
})

let cells = [
  {
    label: '额度',   //支持函数
    field: 'money',
    component: () => <div>xxx</div> ,//自定义子组件,优选render函数
    slots: {
       append: () => 元   //插槽
    }
  },
    {
    label: 'xx类型', //标签名
    field: 'reasonType', //字段
    attrs: {
      //mid-vue-cell 属性
      required: true,
      border: true
    },
    component: {
      //组件信息
      name: 'mid-vue-picker', // 组件名
      attrs: {
        //mid-vue-picker 的组件属性
        mode: 'selector',
        rangeKey: 'label',
        valueKey: 'value',
        placeholder: '请选择xxx类型',
        range: niceList,
        onChange: () => handleChangeType()
      }
    }
  },
  {
    render: () => <div>xxx</div> //自定义整个formItem渲染
  },
  {
    attrs:{
      class:"form-item-card"
    },
     children: [   //多层级嵌套
        {
          label: '总重量',
          field: 'contacts',
          attrs: { required: true, border: true },
          component: () => <Input v-model={currState.form.reasonType} placeholder='请输入'></Input>
        },
        {
          label: '总体积',
          field: 'contacts1',
          component: () => <Input v-model={currState.form.reasonType} placeholder='请输入'></Input>
        }
      ]
  }
]

//如果需要校验可以用到
//const { validate, errMsg } = formRef.value.validate();

return () => <Form ref={formRef} cells={cells} v-model={state.form}></Form>
```
