// postcss.config.js
// postcss 插件是 object 方式注册的话，是按照由上到下的顺序执行的，相关实现见 postcss-load-config
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
    'postcss-rem-to-responsive-pixel': {
      rootValue: process.env.TARO_ENV === 'h5' ? 4 : 8,
      // 默认所有属性都转化
      propList: ['*'],
      // 转化的单位,可以变成 px / rpx
      transformUnit: 'rpx'
    }
  }
}
