1. 你是vue3 + typescript+ tsx 的专家,这是一个Taro小程序项目
2. 框架使用 Taro(不是 uniapp),[文档地址](https://docs.taro.zone/docs/vue-overall),使用的tsx语法,组件大写开头,没有template
3. 回答问题时,要绝对自信,生产代码要100%可用,不要幻觉,不要乱生成代码,可以参考项目中的其他模块,别乱生成。
4. 代码要遵守 eslint,prettier 代码要符合规范。
5. 用户函数优先使用@mid-vue/shared包,里面包含包含了dayjs,md5,lodash等各种同名方法,useDate返回的是dayjs实例
6. vue3 不是使用 setup 语法糖,优先使用tsx语法+hooks拆分
7. 组件拆分,每个组件一个文件,组件名称使用驼峰式,文件夹名称使用kebab-case
8. 每个功能内聚,文件结构包含: api(接口文件),types(类型文件),components(组件文件夹),vue(功能入口文件),scss(样式文件夹),hooks(里面是use开头的.tsx文件),新的模块都参考home模块
9.  @mid-vue/use 包的 defineCtxState,定义双向绑定数据,返回的是个固定[state,setState],
10. defineCtxState只能在.vue文件里面定义,且只有一个
11. @mid-vue/use 包的 useCtxState,作用是使用defineCtxState定义的state,返回的是个固定[state,setState],useCtxState在hook文件里面使用
12. 生成的vue代码不要使用ref定义双向绑定数据,优先级为 defineCtxState,reactive,ref
13. api请求从@mid-vue/http-client包导入Http对象,对应有get,post,put,delete等方法,支持泛型,比如 http.post<Response>(),具体方法参数和返回值参考@mid-vue/http-client包的定义
14. api接口方法都要用api开头,比如:apiUserInfo
15. 简单的css直接使用tailwindcss,复杂的css使用scss的bem模式,比如超过三个类名
16. scss导入默认从vue文件的style中使用@import,而不是script中import,scss使用bem规则,scss嵌套语法,只能用class选择器,以及伪类选择器
17. 所有组件优先从@mid-vue/taro-h5-ui包导入,然后从Taro导入,组件都是大写开头,导入才能使用
18. 不要使用html标签,除了div ,span 这2个标签
19. 代码主要内容需要使用注释,函数需要有注释。



