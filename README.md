# good-baby-mini

## 介绍

宝宝生辰八字,喂养指南,成长指南-小程序

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
> pnpm dev:weapp 启动开发
> pnpm build:weapp 打包生产/测试

```

## 预览

安装微信小程序开放工具，选择`packages/core`目录即可，不用选择到`dist`目录

## 准备

### 知识储备

> 为了便于团队协作和提高代码可维护性，请务必熟悉团队开发规范和hook思路

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

Q1. Vue文件中提示 “Cannot find module xx type declarations. Vetur(2307)”

解： VSCODE - 插件： 禁用或移除 "Vetur" 插件，推荐使用 "Vue - Official"

### 微信小程序开发工具

Q1: 点击预览时，提示代码包过大 “Error: 代码包大小超过限制,main package source size 2786KB exceed max limit 2MB ”

解：选中右上角 “详情”，勾选上 “预览及真机调试时主包、分包体积上限调整为4M” 即可解决

Q2: 热更新失效
解：请检查小程序开发工具左上角的热重载功能,把他关闭
