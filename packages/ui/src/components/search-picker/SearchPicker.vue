<template>
  <view class="mv-search-picker-label" @tap.stop="handleOpenPopup">
    {{ state.label }}
  </view>
  <mv-popup v-model="state.show" :position="position" :catch-move="true" height="51%">
    <view class="mv-search-picker">
      <view class="mv-search-picker-toolbar">
        <text class="mv-search-picker-toolbar__left" @tap.stop="handleCancel"> 取消 </text>
        <text class="mv-search-picker-toolbar__right" @tap.stop="handleConfirm"> 确定 </text>
      </view>
      <picker-column
        :options="state.options"
        v-bind="{ ...$attrs, hasRender: state.hasRender }"
        :default-index="state.defaultIndex"
        @change="handleChange"
      ></picker-column>
      <mv-search
        v-model="state.searchVal"
        class="mv-search-picker-search"
        prefix-icon="search"
        :placeholder="searchPlaceholder"
        clearable
        round
        @input="handleInput"
      ></mv-search>
      <mv-safe-bottom></mv-safe-bottom>
    </view>
  </mv-popup>
</template>
<script>
import { reactive, watch } from 'vue'
import mvPopup from '../popup'
import mvSearch from '../search'
import { debounce, deepclone } from '../../utils/lodash'
import PickerColumn from './PickerColumn.vue'
export default {
  name: 'MvSearchPicker',
  components: {
    'picker-column': PickerColumn,
    'mv-popup': mvPopup,
    'mv-search': mvSearch
  },
  inheritAttrs: false,
  props: {
    modelValue: {
      type: [String, Number],
      default: ''
    },
    position: {
      type: String,
      default: 'bottom'
    },
    searchPlaceholder: {
      type: String,
      default: '请输入'
    },
    disabled: {
      type: Boolean,
      default: false
    },
    maxCount: {
      type: Number,
      default: 40
    },
    range: { type: Array, default: () => [] }
  },
  emits: ['update:modelValue', 'change', 'confirm'],
  setup(props, { emit, attrs }) {
    //选中item的index下标
    let pickIndex = 0
    const state = reactive({
      show: false,
      options: [],
      defaultIndex: 0,
      label: '',
      searchVal: '',
      hasRender: false //默认进入不渲染popup
    })

    //设置选择的index
    const setPickerIndex = () => {
      const key = attrs.valueKey || attrs.rangeKey
      const _index = props.range.findIndex((item) => {
        const i = key ? item[key] : item
        return i === props.modelValue
      })
      //这里pickeIndex 重置为range数组的下标
      pickIndex = _index < 0 ? 0 : _index
    }

    //获取 选中的对象
    const getPickerLabel = () => {
      const item = props.range[pickIndex]
      const key = attrs.rangeKey || attrs.valueKey
      return key ? item?.[key] : item
    }

    watch(
      () => props.modelValue,
      () => {
        setPickerIndex()
        state.label = getPickerLabel()
      },
      { immediate: true }
    )

    /**
     * 切割有效数组
     * pickIndex 切割位置
     * 需要分割的数组
     */
    const sliceOption = (_pickIndex, filters) => {
      const options = filters || deepclone(props.range)
      //如果不是第一个，就插入第一个后面（考虑有请选择的情况）
      if (_pickIndex !== 0) {
        const item = options.splice(_pickIndex, 1)[0]
        options.splice(1, 0, item)
        state.defaultIndex = pickIndex = 1
      } else {
        state.defaultIndex = pickIndex = 0
      }
      state.options = options.slice(0, props.maxCount)
    }

    //点击打开popup
    const handleOpenPopup = () => {
      if (props.disabled) return
      state.hasRender = true
      sliceOption(pickIndex)
      state.show = true
    }

    const handleConfirm = () => {
      const valuekey = attrs.valueKey || attrs.rangeKey
      const item = state.options[pickIndex]
      const value = valuekey ? item?.[valuekey] : item
      emit('update:modelValue', value)
      state.searchVal = ''
      state.show = false
      emit('confirm', item)
      setPickerIndex()
    }

    const handleCancel = () => {
      state.searchVal = ''
      state.show = false
    }

    const handleChange = (index) => {
      //设置下标为option的下标
      pickIndex = index
      emit('change', index)
    }

    //搜索框触发
    const handleInput = debounce((e) => {
      const searchVal = e.target.value?.toUpperCase()
      if (!searchVal) {
        sliceOption(0)
        return
      }
      const key = attrs.rangeKey || attrs.valueKey
      const filters = props.range.filter((item) => {
        const _item = key ? item?.[key] : item
        return _item.toUpperCase().includes(searchVal)
      })
      sliceOption(0, filters)
    })

    return {
      state,
      handleConfirm,
      handleCancel,
      handleOpenPopup,
      handleChange,
      handleInput
    }
  }
}
</script>

<style lang="scss">
.mv-search-picker-label {
  width: 100%;
  line-height: 1.5;
}

.mv-search-picker {
  width: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
  height: 100%;
  overflow: hidden;

  &-toolbar {
    width: 100%;
    line-height: 44px;
    position: relative;
    top: 0;
    left: 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 15px;
    background-color: #fff;

    &__left {
      color: $text-color;
      cursor: pointer;
      height: 100%;
      display: inline-flex;
      align-items: center;
      padding: 0 8px;
      flex: none;
    }

    &__right {
      display: inline-flex;
      align-items: center;
      height: 100%;
      color: $primary-color;
      cursor: pointer;
      padding: 0 8px;
      flex: none;
    }

    &::after {
      position: absolute;
      box-sizing: border-box;
      content: ' ';
      pointer-events: none;
      right: 0;
      bottom: 0;
      left: 0;
      border-bottom: 1px solid $border-color;
      transform: scaleY(0.5);
      @extend %px-media;
    }
  }

  &-search {
    width: 100%;
    margin-bottom: 5px;
  }
}
</style>
