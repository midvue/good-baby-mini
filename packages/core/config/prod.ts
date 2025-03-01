import type { UserConfigExport } from '@tarojs/cli'

console.log('\x1B[31m%s\x1B[0m', '------- 环境地址 ---------------')

export default {
  env: {
    NODE_ENV: '"production"'
  },
  defineConstants: {},
  mini: {
    commonChunks: ['runtime', 'vendors', 'taro', 'common']
    // webpackChain(chain) {
    //   chain.module
    //     .rule('sharevue')
    //     .test(function (path) {
    //       return path.includes('\\src\\pages\\') && path.endsWith('index.vue')
    //     })
    //     .use('shareVueLoader')
    //     .loader(path.resolve(__dirname, '../loaders/shareVueLoader'))

    //   chain.plugin('providerPlugin').tap((args) => {
    //     args[0].$TzNotify = ['@tz-mall/weapp-ui', 'TzNotify']
    //     return args
    //   })

    //   chain.plugin('analyzer').use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin, [])
    // }
  },
  h5: {
    //如果h5端编译后体积过大，可以使用webpack-bundle-analyzer插件对打包体积进行分析。
    // 参考代码如下：
    webpackChain(chain, webpack) {
      // chain.plugin('providerPlugin').use(webpack.ProvidePlugin, [
      //   {
      //     $TzNotify: ['@tz-mall/weapp-ui', 'TzNotify']
      //   }
      // ])
      /*     chain.merge({
        optimization: {
          splitChunks: {
            cacheGroups: {
              nutui: {
                name: "nutui",
                test: /[\\/]node_modules[\\/]@nutui[\\/]/,
                priority: 3,
                reuseExistingChunk: true,
              },
            },
          },
        },
      }),
        chain
          .plugin("analyzer")
          .use(require("webpack-bundle-analyzer").BundleAnalyzerPlugin, []); */
      /**
       * WebpackChain 插件配置
       * @docs https://github.com/neutrinojs/webpack-chain
       */
      //   chain.plugin('analyzer')
      //     .use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin, [])
      //   /**
      //    * 如果 h5 端首屏加载时间过长，可以使用 prerender-spa-plugin 插件预加载首页。
      //    * @docs https://github.com/chrisvfritz/prerender-spa-plugin
      //    */
      //   const path = require('path')
      //   const Prerender = require('prerender-spa-plugin')
      //   const staticDir = path.join(__dirname, '..', 'dist')
      //   chain
      //     .plugin('prerender')
      //     .use(new Prerender({
      //       staticDir,
      //       routes: [ '/pages/index/index' ],
      //       postProcess: (context) => ({ ...context, outputPath: path.join(staticDir, 'index.html') })
      //     }))
      // }
    }
  }
} satisfies UserConfigExport<'webpack5'>
