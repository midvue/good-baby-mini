<template>
  <image-core v-bind="$attrs" :src="imgSrc" :mode="mode" class="mv-image" @tap="handleTap">
    <slot></slot>
  </image-core>
</template>
<script lang="ts">
import { computed, defineComponent, type PropType } from 'vue'
import { Image, type BaseEventOrig, type ImageProps } from '@tarojs/components'

const BASE_URL = 'https://kydl.kyslb.com/mid-vue/xiaochengxu/mv-mini-zc/'

export default defineComponent({
  name: 'MvImage',
  components: { imageCore: Image },
  inheritAttrs: false,
  props: {
    mode: {
      type: String as PropType<keyof ImageProps.Mode>,
      default: 'aspectFit'
    },
    src: {
      type: String,
      default: ''
    },
    onClick: {
      type: Function as PropType<(event: BaseEventOrig) => void>
    }
  },
  setup(props) {
    const regImgPrefix = /^(wxfile|http|https|data):/

    const imgSrc = computed(() => {
      // return regImgPrefix.test(props.src) ? props.src : `${BASE_URL}${props.src}`
      return props.src
    })

    const handleTap = (event: BaseEventOrig) => {
      if (props.onClick) {
        event.stopPropagation()
        props.onClick(event)
      }
    }
    return { handleTap, imgSrc }
  }
})
</script>

<style lang="scss">
.mv-image {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: none;
}
</style>
