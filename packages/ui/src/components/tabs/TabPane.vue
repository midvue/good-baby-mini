<template>
  <view v-show="active" class="mv-tab-pane" v-bind="$attrs">
    <slot></slot>
  </view>
</template>
<script>
import { computed, inject } from 'vue'
export default {
  name: 'MvTabPane',
  props: {
    name: {
      type: [String, Number],
      default: ''
    },
    label: String
  },
  setup(props) {
    const rootTabs = inject('rootTabs')
    const active = computed(() => {
      return rootTabs.currentName.value === props.name
    })

    return {
      active
    }
  }
}
</script>

<style lang="scss">
.mv-tab-pane {
  display: flex;
  width: 100%;
  flex-direction: column;
  align-items: center;
  height: 100%;
}
</style>
