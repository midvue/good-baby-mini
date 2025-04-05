<script setup lang="ts">
import appConfig from '@/app.config'
import { useAppStore } from '@/stores'
import { useRoute } from '@/use'
import { getConfigProvider } from '@mid-vue/taro-h5-ui'
import { Image, View } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { computed, ref } from 'vue'

const { model, screenHeight } = getConfigProvider()
//判断是否是iphone x 以上手机

let isIphoneX = model.includes('iPhone') && screenHeight >= 750
console.log(isIphoneX)

let appStore = useAppStore()

let { path } = useRoute()

let selected = computed(() => {
  return appStore.tabBarPath || path
})

const color = appConfig.tabBar.color
const selectedColor = appConfig.tabBar.selectedColor
const list = appConfig.tabBar.list.map((item) => {
  return {
    ...item,
    selectedIconPath: '../' + item.selectedIconPath,
    iconPath: '../' + item.iconPath
  }
})

function switchTab(url: string) {
  appStore.tabBarPath = url
  Taro.switchTab({ url: '/' + url })
}
</script>

<template>
  <View :class="['mv-tab-bar', { 'mv-safe-bottom': isIphoneX }]">
    <View
      v-for="item in list"
      :key="item.pagePath"
      class="tab-bar-item"
      @tap="switchTab(item.pagePath)"
    >
      <Image
        class="tab-bar-item-icon"
        v-show="selected === item.pagePath"
        :src="item.selectedIconPath"
      />
      <Image class="tab-bar-item-icon" v-show="selected !== item.pagePath" :src="item.iconPath" />
      <View :style="{ color: selected === item.pagePath ? selectedColor : color }">{{
        item.text
      }}</View>
    </View>
  </View>
</template>

<style lang="scss">
.mv-tab-bar {
  width: 100%;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: white;
  display: flex;

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
    height: 52px;
  }

  .tab-bar-item-icon {
    width: 22px;
    height: 22px;
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
