<template>
  <view @click="onClick" :catch-move="catchMove">
    <slot></slot>
    <div v-show="showBottom" class="mv-config-provider-bottom"></div>
  </view>
</template>
<script lang="ts">
import { defineComponent, provide, ref } from 'vue'
import { CONFIG_PROVIDER } from '../../constants'

export default defineComponent({
  name: 'MvConfigProvider',
  props: { catchMove: Boolean },
  setup() {
    const showBottom = ref(false)
    const outSideMap = {} as Record<string, Function>
    const onClick = (e: MouseEvent) => {
      Object.values(outSideMap).forEach((clickFunc) => clickFunc(e))
    }

    // 注册全局点击事件
    function registerOutSlideClick(id: string, func: Function) {
      outSideMap[id] = func
    }

    function setBottomVisible(visible: boolean) {
      showBottom.value = visible
    }

    provide(CONFIG_PROVIDER, {
      registerOutSlideClick,
      setBottomVisible
    })

    return { onClick, showBottom }
  }
})
</script>

<style lang="scss">
.mv-config-provider-bottom {
  width: 100%;
  flex: none;
  height: 100px;
}
</style>
