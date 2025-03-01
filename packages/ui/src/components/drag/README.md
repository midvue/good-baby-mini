# Drag 拖拽

### 介绍

实现可拖拽的任意元素

### 安装

```js
import { Drag } from '@mid-vue/taro-h5-ui'
```

### 基础用法

```js
<Drag direction='y'></Drag>
```

## API

### Props

| 参数      | 说明                                    | 类型   | 默认值 |
| --------- | --------------------------------------- | ------ | ------ |
| direction | 拖拽元素的拖拽方向限制，`x`、`y`、`all` | string | `all`  |
