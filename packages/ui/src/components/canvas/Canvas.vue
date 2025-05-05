<template>
  <canvas class="mv-canvas" :catch-move="true">
    <slot></slot>
  </canvas>
</template>
<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'MvCanvas',
  setup() {
    return {}
  }
})
</script>

<style></style>
