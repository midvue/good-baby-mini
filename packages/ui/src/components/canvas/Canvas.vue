<template>
  <canvas class="mv-canvas" :catch-move="catchMove">
    <slot></slot>
  </canvas>
</template>
<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'MvCanvas',
  props: {
    catchMove: {
      type: Boolean,
      default: true
    }
  },
  setup() {
    return {}
  }
})
</script>

<style></style>
