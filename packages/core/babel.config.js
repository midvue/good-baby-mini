// babel-preset-taro 更多选项和默认值：
// https://github.com/NervJS/taro/blob/next/packages/babel-preset-taro/README.md
module.exports = {
  presets: [
    [
      'taro',
      {
        framework: 'vue3',
        ts: true,
        vueJsx: true,
        compiler: 'webpack5',
        plugins: ['@babel/plugin-proposal-optional-chaining']
      }
    ]
  ],
  plugins: ['@babel/plugin-proposal-optional-chaining']
}
