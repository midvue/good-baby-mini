<template>
  <image-core v-bind="$attrs" :src="imgSrc" :mode="mode" class="mv-image" @tap="handleTap">
    <slot></slot>
  </image-core>
</template>
<script lang="ts">
import { computed, defineComponent, type PropType } from 'vue'
import { Image, type BaseEventOrig, type ImageProps } from '@tarojs/components'

const BASE_URL = `${ENV_CDN_BASE}image/`

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
      type: Function as PropType<(event: BaseEventOrig<string>) => void>
    }
  },
  setup(props) {
    // 网络地址,base64,file地址,/开头不带: 的地址都不加cdn前缀

    const regImgPrefix = /^(wxfile:|http:|https:|data:|\/)/

    // 不以/开头的地址,都加上前缀

    const imgSrc = computed(() => {
      return regImgPrefix.test(props.src) ? props.src : `${BASE_URL}${props.src}`
    })

    const handleTap = (event: BaseEventOrig) => {
      if (props.onClick) {
        event.stopPropagation()
        event.detail = imgSrc.value
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
