<template>
  <view class="mv-swiper-wrapper">
    <swiper
      class="mv-swiper"
      :indicator-dots="indicatorDots"
      :autoplay="autoplay"
      v-bind="$attrs"
      indicator-active-color="#ffffff"
      indicator-color="#dedede"
    >
      <swiper-item v-for="(item, index) in items" :key="index">
        <view class="swiper-item" @click="handleSwiperClick(item, index)">
          <slot v-if="$slots.swiper" name="swiper" :url="item[swiperKey]"></slot>
          <mv-image v-else :src="item[swiperKey]" class="mv-swiper-image"></mv-image>
        </view>
      </swiper-item>
    </swiper>
    <slot v-if="$slots.navbar" name="navbar"></slot>
  </view>
</template>
<script lang="ts">
import { type PropType, defineComponent } from 'vue'
import mvImage from '../image'
export default defineComponent({
  name: 'MvSwiper',
  components: { mvImage },
  inheritAttrs: false,
  props: {
    items: {
      type: Array as PropType<Record<string, any>[]>,
      default: () => []
    },
    swiperKey: {
      type: String,
      default: 'url'
    },
    indicatorDots: {
      type: Boolean,
      default: true
    },
    autoplay: {
      type: Boolean,
      default: true
    }
  },
  emits: ['item-click'],
  setup(_, { emit }) {
    const handleSwiperClick = (item: Record<string, any>, index: number) => {
      emit('item-click', item, index)
    }
    return { handleSwiperClick }
  }
})
</script>
<style lang="scss">
.mv-swiper-wrapper {
  width: 100%;
  height: 100%;
  position: relative;
  .mv-swiper {
    width: 100%;
    height: 100%;
    .swiper-item {
      width: 100%;
      height: 100%;
    }
    .mv-swiper-image {
      width: 100%;
    }
  }
}
</style>
