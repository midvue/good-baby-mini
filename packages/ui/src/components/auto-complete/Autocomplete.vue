<template>
  <view class="mv-autocomplete" @click="onClick">
    <Search
      :id="state.id"
      :placeholder="placeholder"
      v-bind="$attrs"
      @input="handleInput"
      @clear="handleClear"
      @search="handleSearch"
      @focus="onFocus"
      :focus="focus"
      :maxlength="maxlength"
      :formatter="formatter"
      :prefix-icon="prefixIcon"
    ></Search>
    <popover v-model="showPopover" :offset="state.offset">
      <view class="mv-autocomplete-list">
        <view
          v-for="(item, index) in state.options"
          :key="index"
          class="mv-autocomplete-item"
          @click="handleItemClick(item)"
        >
          <slot name="option" :item="item" :index="index">
            <view v-html="item.richLabel"></view>
          </slot>
        </view>
        <view v-show="state.showEmpty" class="empty-placeholder"> 没有匹配的数据 </view>
      </view>
    </popover>
  </view>
</template>
<script lang="ts">
import { computed, defineComponent, type PropType, reactive, type SlotsType } from 'vue'
import { inject } from 'vue'
import Taro, { useReady } from '@tarojs/taro'
import { type CommonEvent } from '@tarojs/components'
import { debounce, uniqueId } from '@mid-vue/shared'
import { CONFIG_PROVIDER } from '../../constants'
import Search from '../search'
import Popover from './Popover.vue'
import { type AutoCompleteOption } from './types'
export default defineComponent({
  name: 'MvAutocomplete',
  components: {
    popover: Popover,
    Search
  },
  inheritAttrs: false,
  props: {
    options: {
      type: Array as PropType<Record<string, any>[]>,
      default: () => []
    },
    labelKey: {
      type: String,
      default: 'label'
    },
    fetchSuggestions: {
      type: Function as PropType<(value: string, func: (arg: any[]) => void) => void>,
      default: () => ({})
    },
    isShowEmpty: {
      type: Boolean,
      default: true
    },
    id: {
      type: String,
      default: 'autocomplete-'
    },
    duration: {
      type: Number,
      default: 300
    },
    prefixIcon: {
      type: String,
      default: 'search'
    },
    placeholder: {
      type: String,
      default: '请输入搜索内容'
    },
    onFocus: {
      type: Function as PropType<(event: Event) => void>
    },
    onOutSlideClick: {
      type: Function as PropType<(event: CommonEvent) => void>
    },
    maxlength: Number,
    focus: Boolean,
    formatter: {
      type: Function as PropType<(val: string) => string | number>
    }
  },
  slots: Object as SlotsType<{
    default: void
    item: AutoCompleteOption
  }>,
  emits: ['search', 'clear', 'update:modelValue', 'select'],
  setup(props, { emit }) {
    const state = reactive({
      id: props.id + uniqueId(),
      show: false,
      offset: 0,
      options: props.options as AutoCompleteOption[],
      showEmpty: false
    })
    useReady(() => {
      Taro.createSelectorQuery()
        .select(`#${state.id}`)
        .boundingClientRect()
        .exec((res) => {
          state.offset = res?.[0]?.height
        })
    })

    const handleOptions = (options: Record<string, any>[], value: string = '') => {
      return options.map((item) => {
        const label = item?.[props.labelKey] || item
        const richLabel = label.replace(value, "<em class='text-active'>$&</em>")
        return { label, richLabel, data: item }
      })
    }

    //防抖处理查询结果
    const fetchSuggestions = debounce((value: string) => {
      props.fetchSuggestions(value, (options) => {
        if (!options?.length) {
          state.showEmpty = true
          state.options = []
          return
        }
        state.options = handleOptions(options, value)
        state.showEmpty = false
        state.show = !!state.options.length
      })
    }, props.duration)

    const handleInput = (e: Event) => {
      const value = (e.target as HTMLInputElement).value
      emit('update:modelValue', value)
      fetchSuggestions(value)
    }

    //处理搜索
    const handleSearch = (event: Event) => {
      state.show = false
      emit('search', event)
    }

    const handleClear = () => {
      emit('update:modelValue', '')
      state.show = false
      emit('clear')
    }

    // 搜索条目点击事件
    const handleItemClick = (item: AutoCompleteOption) => {
      state.show = false
      emit('update:modelValue', item.label)
      emit('select', item.data)
    }

    /** 外部调用 判断是否展示popover */
    const isShow = () => state.show

    function show(options?: Record<string, any>[]) {
      if (options) {
        state.options = handleOptions(options)
      }
      state.show = true
    }

    function hide() {
      state.show = false
    }

    const showPopover = computed(() => {
      if (!state.offset) {
        Taro.createSelectorQuery()
          .select(`#${state.id}`)
          .boundingClientRect()
          .exec((res) => {
            state.offset = res?.[0]?.height || 36
          })
      }

      if (props.isShowEmpty) {
        return state.show
      } else {
        //如果不显示空数据提示，当数据为空时，不显示下拉框
        return state.show && !state.showEmpty
      }
    })

    //防止点击事件冒泡到父元素
    const onClick = (e: MouseEvent) => {
      e.stopPropagation()
    }

    // 处理全局点击事件
    const configProvider = inject(CONFIG_PROVIDER, {} as Record<string, Function>)
    configProvider.registerOutSlideClick?.(state.id, (e: CommonEvent) => {
      props.onOutSlideClick?.(e)
    })

    return {
      state,
      show,
      hide,
      isShow,
      handleInput,
      handleSearch,
      handleClear,
      handleItemClick,
      onClick,
      showPopover
    }
  }
})
</script>

<style lang="scss">
.mv-autocomplete {
  display: flex;
  align-items: center;
  position: relative;
  width: 100%;
  &-list {
    width: 100%;
    max-height: 440px;
    text-align: center;
    overflow-y: auto;
    display: flex;
    flex-direction: column;

    .empty-placeholder {
      color: $text-color;
      font-size: 15px;
      padding-top: 10px;
    }
  }
  &-item {
    flex: 1;
    padding: 7px 12px;
    box-sizing: content-box;
    display: flex;
    align-items: center;
    font-size: 14px;
    line-height: 20px;
    text-align: left;
    box-sizing: border-box;

    &:active {
      background-color: $hover-color;
    }
    .prefix-icon,
    .suffix-icon {
      font-size: inherit;
      margin-right: 3px;
      color: $text-color;
    }
    .text-active {
      color: $primary-color;
    }
  }
}
</style>
