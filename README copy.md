## 介绍

这是货主整车小程序

## 快速开始

```shell
#安装taro (已安装可以忽略)
> npm install -g @tarojs/cli

# 安装pnpm (已安装可以忽略)
# node 18+
> npm install -g pnpm
```

```shell
# 安装依赖库
> pnpm install
```

```shell
#货主端整车小程序
> pnpm dev:weapp 启动开发
> pnpm build:weapp 打包生产/测试
```

## 准备

### 知识储备

> 为了便于团队协作和提高代码可维护性，请务必熟悉团队开发规范和hook思路

1. 务必了解 ECS 开发规范：[前往学习了解](http://mid-vue-doc-dev.kyslb.com/guide/rules/js-rules.html)
2. 务必了解 hook 编程思路：[前往学习了解](http://mid-vue-doc-dev.kyslb.com/guide/hooks/hook-intro.html)

![详情](https://ic-img.ky-express.com/default/20240927_18368858074_!!1727433560488_1795_913.png)

## 目录结构

```js
└─packages
   ├─core
   |   └─ src            # 项目资源文件
   |       └─ pages      # 项目页面
   └─ui                  # 通用组件库
```

## 常见问题

### VSCode开发工具

Q1. Vue文件中提示 “Cannot find module '@/stores/app'or its corresponding type declarations. Vetur(2307)”

解： VSCODE - 插件： 禁用或移除 "Vetur" 插件，推荐使用 "Vue - Official"

### 微信小程序开发工具

Q1: 点击预览时，提示代码包过大 “Error: 代码包大小超过限制,main package source size 2786KB exceed max limit 2MB ”

![](https://ic-img.ky-express.com/default/20240927_2736885804_!!1727410829309_690_396.png)

解：选中右上角 “详情”，勾选上 “预览及真机调试时主包、分包体积上限调整为4M” 即可解决

![](https://ic-img.ky-express.com/default/20240927_45568858036_!!1727423865795_1375_927.png)
