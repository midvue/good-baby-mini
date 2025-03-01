<template>
  <canvas class="mv-canvas" :catch-move="true">
    <slot></slot>
  </canvas>
</template>
<script>
export default {
  name: 'MvCanvas',
  setup() {
    return {}
  }
}
</script>

<style></style>
