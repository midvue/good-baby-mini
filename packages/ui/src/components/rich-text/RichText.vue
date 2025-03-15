<template>
  <div class="mv-rich-text" v-html="htmlRef"></div>
</template>

<script lang="ts">
import { ref, watch, defineComponent } from 'vue'

export default defineComponent({
  name: 'MvRichText',
  inheritAttrs: false,
  props: {
    content: {
      type: String,
      default: ''
    }
  },
  setup(props) {
    const htmlRef = ref('')
    const formateTable = (result: string) => {
      const data = result.replace(/<table([\s\w"-=/.:;]+)/gi, (_, arg1) => {
        const style = arg1.replace(/=/g, ':').replace(/"/g, '').split(' ').join(';')
        const className = style.includes('border:') ? 'table-border' : ''
        return `<table ${arg1} style="${style}" class="${className}"`
      })

      return data
    }

    function formatRichContent(result: string) {
      const data = formateTable(result)
        .replace(/&tp=&webp/gi, '&')
        .replace(/(&nbsp;|&emsp;)/g, ' ')
        .replace(/&amp;/g, '<pre class="escape">&</pre>')
        // 小程序无法识别<br>标签，这里使用div占位
        .replace(/<br\s*\/?>/gi, '<div> </div>')
      return data
    }

    watch(
      () => props.content,
      (content) => {
        htmlRef.value = formatRichContent(content)
      },
      {
        immediate: true
      }
    )

    return { htmlRef }
  }
})
</script>

<style lang="scss">
.mv-rich-text {
  width: 100%;
  font-size: 15px;

  .h5-ol {
    list-style-type: decimal;
  }

  ul {
    margin-left: 1.5em;
    li {
      &::before {
        content: '';
        width: 4px;
        height: 4px;
        line-height: 4px;
        display: inline-block;
        text-align: center;
        margin-right: 0.2em;
        margin-bottom: 0.2em;
        white-space: nowrap;
        background-color: var(--mv-title-color);
        border-radius: 50%;
      }
    }
  }

  ol {
    margin-left: 1.5em;
    counter-reset: section;
    li {
      &::before {
        font-size: inherit;
        counter-increment: section;
        content: counters(section, '-') '. ';
        display: inline-block;
        text-align: center;
        margin-right: 0.4em;
        margin-bottom: 0.4em;
        white-space: nowrap;
      }
    }
  }
  u {
    text-decoration: underline;
  }

  p {
    display: block;
    margin-block-end: 0.5em;
  }

  h1 {
    font-size: 2em;
  }

  h2 {
    font-size: 1.5em;
  }

  h3 {
    font-size: 1.17em;
  }

  h4 {
    font-size: 1em;
  }

  h5 {
    font-size: 0.9em;
  }

  h6 {
    font-size: 0.8em;
  }

  a {
    text-decoration: underline;
  }

  em {
    font-style: italic;
  }
  .h5-s,
  .h5-strike,
  .h5-del {
    text-decoration: line-through;
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6,
  b,
  strong {
    font-weight: bolder;
  }

  /* 表格 */
  .table-border {
    border: 1px solid #dadada;
    th,
    td {
      border: 1px solid #dadada;
    }
  }

  table {
    display: table;
    width: 100%;
  }

  tbody {
    display: table-row-group;
    width: 100%;
  }
  tr {
    display: table-row;
  }
  th {
    display: table-cell;
    font-weight: bold;
  }
  td {
    display: table-cell;
  }
}
</style>
