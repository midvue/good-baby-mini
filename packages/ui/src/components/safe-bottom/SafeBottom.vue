<template>
  <view v-if="show" class="mv-safe-bottom" :style="{ height: height }"> </view>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { getConfigProvider } from '../../use/useConfigProvider'
export default defineComponent({
  name: 'MvSafeBottom',
  inheritAttrs: false,
  props: {
    height: {
      type: [String, Number]
    }
  },
  emits: ['click'],
  setup() {
    const show = ref(false)
    const { model, screenHeight } = getConfigProvider()
    //判断是否是iphone x 以上手机
    if (model.includes('iPhone') && screenHeight >= 750) {
      show.value = true
    }

    return { show }
  }
})
</script>

<style>
.mv-safe-bottom {
  width: 100%;
  height: 20px;
  flex: none;
}
</style>
