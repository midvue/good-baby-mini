<template>
  <view class="mv-view" v-bind="$attrs"><slot /></view>
</template>
<script>
export default {
  name: 'mvView',
  inheritAttrs: false,
  setup() {
    return {}
  }
}
</script>

<style></style>
