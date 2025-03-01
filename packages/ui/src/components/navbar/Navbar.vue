<template>
  <div
    class="mv-navbar"
    :style="{
      height: navBarHeight + 'px',
      paddingTop: statusBarHeight + 'px',
      position: position,
      background: bgColor,
      paddingRight: paddingRight + 'px'
    }"
  >
    <slot></slot>
    <template v-if="!$slots.default">
      <div class="left">
        <slot v-if="!!$slots.left" name="left"></slot>
        <div v-else-if="leftArrow || showHome" class="mv-navbar-pill">
          <span
            class="btn-navbar-pill"
            hover-class="btn-navbar-pill__hover"
            :hover-start-time="17"
            :hover-stay-time="68"
            v-show="leftArrow"
            @click.stop="handleNavBack"
          >
            <mv-icon name="mv-icon-arrow-left"></mv-icon>
          </span>
          <span
            class="btn-navbar-pill"
            hover-class="btn-navbar-pill__hover"
            :hover-start-time="17"
            :hover-stay-time="68"
            v-show="showHome"
            @click.stop="handleNavHome"
          >
            <mv-icon name="mv-icon-home"></mv-icon>
          </span>
        </div>
      </div>
      <div class="title">{{ navBarTitle }}</div>
      <div class="right">
        <slot v-if="!!$slots.right" name="right"></slot></div
    ></template>
  </div>
  <div
    v-if="position === 'fixed' && clearfix"
    :style="{
      backgroundColor: 'transparent',
      height: navBarHeight + 'px',
      flex: 'none'
    }"
  ></div>
</template>
<script lang="ts">
import { defineComponent, reactive, toRefs } from 'vue'
import Taro, { usePageScroll } from '@tarojs/taro'

import { throttle } from '@mid-vue/shared'
import { getConfigProvider } from '../../use/useConfigProvider'
import { Icon } from '../icon'
import { props } from './props'

export default defineComponent({
  name: 'MvNavbar',
  components: { mvIcon: Icon },
  inheritAttrs: false,
  props,
  setup(props, { slots }) {
    const { navBarHeight, statusBarHeight, homeUrl, navBarWidth, windowWidth } = getConfigProvider()

    const state = reactive({
      navBarHeight,
      statusBarHeight,
      paddingRight: props.autoBounding ? windowWidth - navBarWidth : 0,
      bgColor: props.defaultConfig.backgroundColor,
      navBarTitle: props.title || props.defaultConfig.title
    })

    const handleNavBack = () => {
      if (!props.leftArrow || slots.left) return
      if (props.onBack) {
        props.onBack()
        return
      }
      Taro.navigateBack().catch(() => {
        if (!homeUrl) {
          console.warn('没有设置首页 homeUrl')
          return
        }
        Taro.reLaunch({
          url: homeUrl
        })
      })
    }

    const handleNavHome = () => {
      if (!homeUrl) {
        console.warn('没有设置首页 homeUrl')
        return
      }
      if (props.onHome) {
        props.onHome()
        return
      }
      Taro.reLaunch({
        url: homeUrl
      })
    }
    Taro.setNavigationBarColor(props.defaultConfig)

    if (props.autoTheme) {
      const scrollFn = throttle((res: Taro.PageScrollObject) => {
        const config =
          res.scrollTop - props.scrolledHeight >= 0 ? props.scrolledConfig : props.defaultConfig
        Taro.setNavigationBarColor(config)
        state.bgColor = config.backgroundColor
        state.navBarTitle = config.title || props.title
      }, 32)
      usePageScroll(scrollFn)
    }

    return { ...toRefs(state), handleNavBack, handleNavHome }
  }
})
</script>
<style lang="scss">
.mv-navbar {
  width: 100%;
  display: flex;
  align-items: center;
  z-index: 999;
  padding: 0 8px;
  font-size: 17px;
  color: $title-color;
  top: 0;
  left: 0;
  transition:
    color,
    background-color 0.1s linear;

  .left {
    flex: 1;
    display: flex;
    align-items: center;
    .left-default {
      width: 100%;
      display: flex;
      align-items: center;
    }
    .navbar-left-text {
      font-size: 17px;
    }
    .arrow-left {
      font-size: 17px;
      flex: none;
      width: 20px;
    }
  }

  .mv-navbar-pill {
    height: 32px;
    border-radius: 16px;
    display: flex;
    border: 1px solid #e3e2ed;
    overflow: hidden;
    margin-left: 6px;
    background-color: rgba(255, 255, 255, 0.5);
    .btn-navbar-pill {
      height: 100%;
      width: 42px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      position: relative;
      .mv-icon {
        font-weight: 600;
      }
      & + .btn-navbar-pill::before {
        content: '';
        position: absolute;
        left: -1px;
        top: 21%;
        height: 60%;
        width: 1px;
        background-color: #e3e2ed;
      }
    }
  }
  .btn-navbar-pill__hover {
    background-color: rgba(255, 255, 255, 0.5);
  }

  .title {
    flex: none;
    font-weight: bold;
    font-size: 17px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .right {
    flex: 1;
  }
}
</style>
