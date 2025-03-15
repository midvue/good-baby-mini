<script>
import { h, provide, ref, watch } from 'vue'

export default {
  name: 'MvTabs',
  props: {
    modelValue: {
      type: [String, Number],
      default: '0'
    },
    headerFixed: {
      type: Boolean,
      default: false
    },
    border: {
      type: Boolean,
      default: true
    }
  },
  emits: ['update:modelValue', 'tab-click'],
  setup(props, { emit }) {
    const currentName = ref(props.modelValue)

    const setCurrentName = (value) => {
      if (currentName.value === value) return
      currentName.value = value
      emit('update:modelValue', value)
    }

    const handleClick = (tabName, event) => {
      emit('tab-click', tabName, event)
      setCurrentName(tabName)
    }

    provide('rootTabs', {
      props,
      currentName
    })

    watch(
      () => props.modelValue,
      (modelValue) => {
        setCurrentName(modelValue)
      }
    )

    return {
      handleClick,
      currentName
    }
  },
  render() {
    const { handleClick, currentName } = this

    const slotsList = this.$slots.default()
    const tabPaneSlotList = slotsList.reduce((result, item) => {
      if (item.children?.length) {
        result.push(...item.children.filter((cItem) => cItem?.type?.name === 'mvTabPane'))
      }
      if (item?.type?.name === 'mvTabPane') {
        result.push(item)
      }
      return result
    }, [])
    const slotPropsList = tabPaneSlotList.map((item) => item.props)

    const headerItems = slotPropsList.map((item) => {
      return h(
        'view',
        {
          class: {
            'mv-tabs__item': true,
            activated: item.name === currentName
          },
          onClick: (e) => handleClick(item.name, e)
        },
        item.headerRender?.() || item.label
      )
    })
    const headerFixed = this.$props.headerFixed
    const tabHeader = h(
      'view',
      {
        class: {
          'mv-tabs__header': true,
          'header-fixed': headerFixed
        }
      },
      headerItems
    )
    const panels = this.$slots?.default()
    const tabContent = h(
      'view',
      { class: { 'mv-tabs__content': true, 'header-fixed': headerFixed } },
      panels
    )
    return h('view', { class: { 'mv-tabs': true, border: this.$props.border } }, [
      tabHeader,
      tabContent
    ])
  }
}
</script>

<style lang="scss">
.mv-tabs {
  width: 100%;

  .mv-tabs__header {
    display: flex;

    &.header-fixed {
      position: fixed;
      width: 100%;
      z-index: 1;
    }

    .mv-tabs__item {
      color: #524d63;
      flex-grow: 1;
      height: 40px;
      display: flex;
      justify-content: center;
      align-items: center;
      line-height: normal;
      &:not(:last-child) {
        border-right: 0;
      }
    }

    .activated {
      color: #03050d;
      font-weight: bold;
      position: relative;
      &::after {
        position: absolute;
        content: '';
        left: 50%;
        bottom: 0;
        transform: translateX(-50%);
        height: 4px;
        width: 24px;
        border-top-left-radius: 4px;
        border-top-right-radius: 4px;
        background-color: var(--mv-primary-color-active);
      }
      /* border-bottom: 2px solid var(--mv-primary-color-active); */
    }
  }

  &.border {
    .mv-tabs__header .mv-tabs__item {
      border: 1px solid #ccc;
    }
  }

  .mv-tabs__content {
    &.header-fixed {
      padding-top: 50px;
    }
  }
}
</style>
