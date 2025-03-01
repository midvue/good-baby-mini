# mvToast 使用方式

> -对外暴露 mvToast  
> -里面有 success，danger，warning，primary 集中状态

```js
export const mvToast = {
  success: (option) => open(option, 'success'),
  danger: (option) => open(option, 'danger'),
  warning: (option) => open(option, 'warning'),
  primary: (option) => open(option, 'primary')
}
```

> option 可以是 String,也可以是对象

```js
option = {
  duration: 2000, //显示时长
  message: '消息内容'
}
```

### 局部引入

```js
import { mvToast } from '@mvUI/mvToast'

mvToast.success('成功的消息')

mvToast.danger('失败的消息')
```

### 全局使用

全局使用无需导入，为了防止冲突，前面加了\$

```js
$mvToast.success('成功的消息')
$mvToast.danger('失败的消息')

$mvToast.success({
  duration: 2000, //显示时长
  message: '消息内容'
})
```
