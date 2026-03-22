<script setup lang="ts">
import { computed } from 'vue'
import { Image, View } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { getConfigProvider } from '@allkit/taro-h5-ui'
import appConfig from '@/app.config'
import { useAppStore } from '@/stores'
import { useRoute } from '@/use'
defineOptions({
  name: 'CustomTabBar'
})

const { model, screenHeight } = getConfigProvider()
//判断是否是iphone x 以上手机

const isIphoneX = model.includes('iPhone') && screenHeight >= 750

const appStore = useAppStore()

const list = appConfig.tabBar.list.map((item, index) => {
  return {
    ...item,
    selectedIconPath: '../' + item.selectedIconPath,
    iconPath: '../' + item.iconPath,
    isMiddleItem: index === Math.floor(appConfig.tabBar.list.length / 2)
  }
})

/** 首页 */

const color = appConfig.tabBar.color
const selectedColor = appConfig.tabBar.selectedColor

const selected = computed(() => {
  return appStore.tabBarPath || useRoute().path
})

function onSwitchTab(url: string) {
  appStore.tabBarPath = url
  Taro.switchTab({ url: '/' + url })
}
</script>

<template>
  <View :class="['mv-tab-bar', { 'mv-safe-bottom': isIphoneX }]">
    <View
      v-for="item in list"
      :key="item.pagePath"
      :class="['tab-bar-item', { 'tab-bar-item-middle': item.isMiddleItem }]"
      @tap="onSwitchTab(item.pagePath)"
    >
      <View class="tab-bar-item-content">
        <Image
          :class="['tab-bar-item-icon', { 'tab-bar-item-icon-middle': item.isMiddleItem }]"
          v-show="selected === item.pagePath"
          :src="item.selectedIconPath"
        />
        <Image
          :class="['tab-bar-item-icon', { 'tab-bar-item-icon-middle': item.isMiddleItem }]"
          v-show="selected !== item.pagePath"
          :src="item.iconPath"
        />
      </View>
      <View :style="{ color: selected === item.pagePath ? selectedColor : color }">
        {{ item.text }}
      </View>
    </View>
  </View>
</template>

<style lang="scss">
:root,
.mv-tab-bar {
  --mv-tab-bar-item-height: 52px; /* 底部导航栏条目高度 */
  --mv-tab-bar-icon-size: 22px; /* 普通图标大小 */
  --mv-tab-bar-icon-middle-size: 65px; /* 中间图标大小 */
}
.mv-tab-bar {
  width: 100%;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: white;
  display: flex;
  padding-top: 4px; // 为中间图标留出空间

  &.mv-safe-bottom {
    padding-bottom: 20px;
    flex: none;
  }

  .tab-bar-item {
    flex: 1;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    font-size: 12px;
    height: var(--mv-tab-bar-item-height);
  }

  // 中间项特殊样式
  .tab-bar-item-middle {
    // 增加中间项的高度，确保图标可以更大
    padding-top: -10px;
  }

  .tab-bar-item-content {
    // 图标容器，用于控制图标位置
    display: flex;
    align-items: center;
    justify-content: center;
    height: var(--mv-tab-bar-icon-size);
    margin-bottom: 4px;
  }

  .tab-bar-item-icon {
    width: var(--mv-tab-bar-icon-size);
    height: var(--mv-tab-bar-icon-size);
    flex: none;
  }

  // 中间图标更大的样式
  .tab-bar-item-icon-middle {
    width: var(--mv-tab-bar-icon-middle-size);
    height: var(--mv-tab-bar-icon-middle-size);
    // 将中间图标向上偏移，与其他文字保持对齐
    transform: translateY(-20px);
  }

  .tab-bar-item-tool-selected {
    width: var(--mv-tab-bar-icon-size);
    height: var(--mv-tab-bar-icon-size);
    flex: none;
  }

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 1px;
    background-color: #e8e8e8;
    transform: scaleY(0.5);
  }
}
</style>
