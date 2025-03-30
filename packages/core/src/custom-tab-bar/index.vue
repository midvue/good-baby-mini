<template>
  <View class="tab-bar">
    <View class="tab-bar-border"></View>
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

<script setup lang="ts">
import appConfig from '@/app.config'
import { useAppStore } from '@/stores'
import { useRoute } from '@/use'
import { Image, View } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { computed } from 'vue'
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

<style lang="scss">
.tab-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 52px;
  background: white;
  display: flex;
  padding-bottom: env(safe-area-inset-bottom);
  z-index: 100;
}

.tab-bar-border {
  background-color: var(--mv-border-color);
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 1px;
  transform: scaleY(0.5);
}

.tab-bar-item {
  flex: 1;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  font-size: 12px;
}

.tab-bar-item-icon {
  width: 22px;
  height: 22px;
}
</style>
