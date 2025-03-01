<template>
  <text class="mv-text" v-bind="$attrs" @tap="handleTap"><slot></slot></text>
</template>
<script>
export default {
  name: 'MvText',
  inheritAttrs: false,
  emits: ['click'],
  setup(props, { emit }) {
    const handleTap = (event) => {
      emit('click', event)
    }
    return { handleTap }
  }
}
</script>
