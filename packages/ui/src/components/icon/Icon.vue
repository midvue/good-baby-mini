<template>
  <view
    v-bind="$attrs"
    :class="['mv-icon iconfont', nameComRef]"
    @click="handleClick"
    :style="color ? `color: ${color};` : ''"
  >
    <slot></slot>
  </view>
</template>
<script lang="ts">
import { defineComponent, computed } from 'vue'

export default defineComponent({
  name: 'MvIcon',
  inheritAttrs: false,
  props: {
    name: {
      type: String,
      default: ''
    },
    color: {
      type: String,
      default: ''
    }
  },
  emits: ['click'],
  setup(props, { emit }) {
    const nameComRef = computed(() => {
      if (props.name.startsWith('mv-')) {
        return props.name
      }
      return 'mv-icon-' + props.name
    })
    const handleClick = (e: Event) => {
      emit('click', e)
    }
    return { nameComRef, handleClick }
  }
})
</script>

<style lang="scss">
.mv-icon {
  display: inline-block;
  position: relative;
  -webkit-font-smoothing: antialiased;
  color: inherit;
  font-size: inherit;
  text-rendering: auto;
  vertical-align: middle;
  line-height: 1.1;
  flex: none;
  &::before {
    display: inline-block;
  }
}
</style>
