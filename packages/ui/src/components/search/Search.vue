<template>
  <view :id="id" class="mv-search">
    <InputCore
      ref="inputRef"
      v-bind="$attrs"
      :placeholder="placeholder"
      confirm-type="search"
      :class="[
        'mv-search-input',
        { 'mv-search-input--border': border },
        { 'mv-search-input--round': round }
      ]"
      :clearable="clearable"
      :prefix-icon="prefixIcon"
      @confirm="handleConfirm"
    >
      <template #append v-if="$slots.append || showAction"
        ><slot name="append"
          ><div @tap="handleTap" class="mv-search-action">{{ actionText }}</div></slot
        ></template
      >
    </InputCore>
  </view>
</template>
<script lang="ts">
import { ref, defineComponent } from 'vue'
import { Input as InputCore } from '../input'
export default defineComponent({
  name: 'MvSearch',
  components: {
    InputCore
  },
  inheritAttrs: false,
  props: {
    id: { type: String, default: '' },
    clearable: { type: Boolean, default: true },
    actionText: { type: String, default: '搜索' },
    showAction: { type: Boolean, default: false },
    round: { type: Boolean, default: false },
    border: { type: Boolean, default: false },
    prefixIcon: { type: String, default: 'search' },
    bgColor: { type: String, default: '#f6f6fd' },
    placeholder: String
  },
  emits: ['search'],
  setup(_, { emit }) {
    const inputRef = ref()

    const handleTap = (event: Event) => {
      emit('search', event)
    }
    const handleConfirm = (event: Event) => {
      emit('search', event)
    }

    //清除input框
    const clear = () => {
      inputRef.value?.handleClear()
    }

    return { handleTap, handleConfirm, inputRef, clear }
  }
})
</script>

<style lang="scss">
.mv-search {
  display: flex;
  align-items: center;
  line-height: 50px;
  padding: 2px 0;
  font-size: 14px;
  width: 100%;
  position: relative;

  .mv-search-input {
    flex: 1;
    line-height: 32px;
    font-size: inherit;
    border-radius: 8px;
    padding-left: 10px;
    padding-right: 5px;
    background-color: v-bind(bgColor);

    .h5-input {
      min-height: 32px;
    }
    &--border {
      z-index: 2;
      @extend %hairline--surround;
    }
    &--round {
      border-radius: 999px;
      &::before {
        border-radius: 999px;
        z-index: -1;
      }
    }
  }
  .mv-search-action {
    padding-left: 7px;
    padding-right: 10px;
    color: $primary-color;
    cursor: pointer;
    user-select: none;
    font-size: 14px;
    font-weight: bold;
    position: relative;

    &::before {
      content: '';
      position: absolute;
      width: 1px;
      left: 0;
      top: 50%;
      bottom: 0;
      height: 12px;
      transform: translateY(-50%);
      background: #b5b3be;
      flex: none;
    }
  }
}
</style>
