# mvDialog 使用方式

### 1.基本使用

```js
<mid-vue-dialog title='弹框' v-model={state.isShowActive}>
  <mid-vue-view class='test'>这是内容</mid-vue-view>
</mid-vue-dialog>
```

### 2.插槽

```js
<mid-vue-dialog
  noFooter
  v-model={state.isShowActive}
  v-slots={{
    header: () => <span>标题</span>,
    footer: () => <span>底部</span>
  }}
>
  <span>内容</span>
</mid-vue-dialog>
```

### 函数式调用

```tsx
showDialog({
  // 支持jsx,string
  render: () => <div>内容</div>,
  title: '弹框',
  xxx: '' // dialog的其他属性
})
```

### 3.dialog 属性，方法

| 属性      | 默认值 | 描述                                   |
| --------- | ------ | -------------------------------------- |
| v-model   | false  | 隐藏、显示                             |
| title     | 标题   | 标题                                   |
| noFooter  | false  | 默认显示底部，可以用 footer 插槽自定义 |
| lazyLoad  | true   | 懒加载                                 |
| onClose   | ()     | 弹框关闭的回调                         |
| onOpen    | ()     | 弹框显示的回调                         |
| onConfirm | ()     | 点击默认取消按钮的回调                 |
| onCancel  | ()     | 点击默认确定按钮的回调                 |
