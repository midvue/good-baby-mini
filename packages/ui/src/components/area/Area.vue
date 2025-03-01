<template>
  <div class="mv-area-picker">
    <div class="mv-area-picker-header" v-if="showHeader">
      <slot name="header">
        <mv-button plain size="mini" @click="handleClose"> 取消 </mv-button>
        <mv-button type="primary" size="mini" @click="handleConfirm"> 确定 </mv-button>
      </slot>
    </div>
    <picker-view
      :value="defValue"
      @change="handleChange"
      class="mv-area-picker-content"
      v-bind="$attrs"
    >
      <!-- 省 -->
      <picker-view-column :data-value="state.provinceArr" v-if="level >= 1">
        <div
          v-for="(item, idx) in state.provinceArr"
          :key="item.value"
          :class="['mv-area-picker-item', { 'mv-area-picker-item-active': defValue[0] === idx }]"
        >
          <span class="mv-area-picker-item-text"> {{ item.label }}</span>
        </div>
      </picker-view-column>
      <!-- 市 -->
      <picker-view-column v-if="level >= 2">
        <div
          v-for="(item, idx) in state.cityArr"
          :key="item.value"
          :class="['mv-area-picker-item', { 'mv-area-picker-item-active': defValue[1] === idx }]"
        >
          <span class="mv-area-picker-item-text">{{ item.label }}</span>
        </div>
      </picker-view-column>
      <!-- 区 -->
      <picker-view-column v-if="level >= 3">
        <div
          v-for="(item, idx) in state.areaArr"
          :key="item.value"
          :class="['mv-area-picker-item', { 'mv-area-picker-item-active': defValue[2] === idx }]"
        >
          <span class="mv-area-picker-item-text">{{ item.label }}</span>
        </div>
      </picker-view-column>
    </picker-view>
    <div class="mv-area-picker-footer" v-if="showFooter">
      <slot name="footer">
        <mv-button type="primary" @click="handleConfirm"> 确定 </mv-button>
      </slot>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, reactive, ref, watch } from 'vue'
import { nextTick } from '@tarojs/taro'
import Button from '../button'
import { AREA_MAP, areaList, cityList, provinceList } from './config'
import { areaProps } from './props'
import { type TAreaParams, type TAreaState } from './types'

export default defineComponent({
  components: { MvButton: Button },
  props: areaProps,
  emits: ['change', 'confirm', 'close'],
  setup(prop, { emit }) {
    const defValue = ref<number[]>([0, 0, 0])
    const state = reactive<TAreaState>({
      provinceArr: [...provinceList],
      cityArr: [],
      areaArr: []
    })

    watch(
      () => prop.activeValue,
      (val) => {
        if (val) {
          setDefaultActive(val)
        } else {
          initData([0, 0, 0])
        }
      },
      {
        immediate: true
      }
    )

    function initData(val: number[]) {
      const [proviceIndex, cityIndex, areaIndex] = val
      const [oldProviceIndex, oldCityIndex] = defValue.value
      const isProviceChange = proviceIndex !== oldProviceIndex
      const isCityChange =
        !isProviceChange && state.cityArr[cityIndex]?.value !== state.cityArr[oldCityIndex]?.value
      // 1. 如果是省改变，则市、区需置初始0
      // 2. 如果仅市改变，则区置初始0
      const cIdx = isProviceChange ? 0 : cityIndex
      const aIdx = isProviceChange ? 0 : isCityChange ? 0 : areaIndex
      // 市
      const { value: proviceValue } = state.provinceArr[proviceIndex]
      const baseCityList = prop.limit ? state.cityArr : cityList
      state.cityArr = baseCityList.filter(
        (item) => item.value.indexOf(proviceValue.slice(0, 2)) === 0
      )
      // 区
      const { value: cityValue } = state.cityArr[cIdx] || {}
      state.areaArr = areaList.filter((item) => item.value.indexOf(cityValue.slice(0, 4)) === 0)
      defValue.value = [proviceIndex, cIdx, aIdx]
    }

    /** 默认值回填 */
    function setDefaultActive(val: string | number) {
      // 默认激活：省
      const pIndex = provinceList.findIndex((p) => p.value === val)
      if (pIndex !== -1) {
        initData([pIndex, 0, 0])
        return
      }
      // 默认激活：市
      const cIndex = cityList.findIndex((c) => c.value === val)
      if (cIndex !== -1) {
        const province = `${parseInt(`${+val / 10000}`) * 10000}`
        setPickerDefault({ province, city: `${val}`, area: '' })
        return
      }
      // 默认激活：区
      const aIndex = areaList.findIndex((a) => a.value === val)
      if (aIndex === -1) {
        initData([0, 0, 0])
        return
      }
      const province = `${parseInt(`${+val / 10000}`) * 10000}`
      const city = `${parseInt(`${+val / 100}`) * 100}`
      setPickerDefault({ province, city, area: `${val}` })
    }
    /** 设置默认值 */
    async function setPickerDefault({ province, city, area }: Record<keyof TAreaParams, string>) {
      // 省
      const pIdx = state.provinceArr.findIndex((item) => item.value === province)
      // 市
      state.cityArr = cityList.filter((item) => item.value.indexOf(province.slice(0, 2)) === 0)
      const cIdx = state.cityArr.findIndex((item) => item.value === city)
      // 区
      state.areaArr = areaList.filter((item) => item.value.indexOf(city.slice(0, 4)) === 0)
      let aIdx = state.areaArr.findIndex((item) => item.value === area)
      aIdx = aIdx === -1 ? 0 : aIdx
      nextTick(() => {
        // 限制选择区域
        if (prop.limit) {
          state.provinceArr = [{ label: AREA_MAP.province[province], value: province }]
          state.cityArr = [{ label: AREA_MAP.city[city], value: city }]
          // 如果是直辖市，则只允许选择当前区域
          if (AREA_MAP.city[city].includes('直辖')) {
            state.areaArr = [{ label: AREA_MAP.area[area], value: `${area}` }]
          }
          defValue.value = [0, 0, aIdx]
        } else {
          defValue.value = [pIdx, cIdx, aIdx]
        }
      })
    }
    /** 格式化结果 */
    const formatAreaValue = () => {
      const [proviceIndex, cityIndex, areaIndex] = defValue.value
      return {
        province: state.provinceArr[proviceIndex],
        city: state.cityArr[cityIndex],
        area: state.areaArr[areaIndex]
      }
    }

    const handleClose = () => {
      emit('close')
    }
    const handleChange = (val: any) => {
      initData(val.target.value)
      emit('change', formatAreaValue())
    }
    const handleConfirm = () => {
      emit('confirm', formatAreaValue())
    }

    return {
      state,
      defValue,
      handleClose,
      handleChange,
      handleConfirm
    }
  }
})
</script>

<style lang="scss">
.mv-area-picker {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  .mv-area-picker-header {
    flex-shrink: 0;
    padding: 9px 14px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .mv-area-picker-content {
    flex: 1;
    min-height: 100px;
  }
  .mv-area-picker-item {
    font-size: 16px;
    font-weight: normal;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    .mv-area-picker-item-text {
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }
  }
  .mv-area-picker-footer {
    min-height: 62px;
    flex-shrink: 0;
    padding: 9px 14px;
    background-color: #fff;
    .h5-button {
      width: 100%;
    }
  }
}
</style>
