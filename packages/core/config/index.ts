import path from 'node:path'
import { defineConfig, type UserConfigExport } from '@tarojs/cli'
import TsconfigPathsPlugin from 'tsconfig-paths-webpack-plugin'
import { UnifiedWebpackPluginV5 } from 'weapp-tailwindcss/webpack'
import devConfig from './dev'
import prodConfig from './prod'
import stgConfig from './env/stg'
import uatConfig from './env/uat'
import releaseConfig from './env/release'

// 示例, 如果你使用 `vs code` 作为开发工具， 你还可以使用注释的语法引入插件包含的声明文件，可获得类似于typescript的友好提示
/**
 * @typedef { import("@tarojs/plugin-mini-ci").CIOptions } CIOptions
 * @type {CIOptions}
 */
const CIPluginOpt = {
  weapp: {
    appid: 'wx7dfdbaaa00ca7246',
    privateKeyPath: 'config/private.wx7dfdbaaa00ca7246.key'
  },
  // 版本号
  version: '2.0.3',
  // 版本发布描述
  desc: '机器人自动发布'
}

// https://taro-docs.jd.com/docs/next/config#defineconfig-辅助函数
export default defineConfig<'webpack5'>(async (merge) => {
  const baseConfig: UserConfigExport<'webpack5'> = {
    projectName: 'mid-vue-mini-zc',
    date: '2024-8-30',
    designWidth: 375,
    deviceRatio: {
      640: 2.34 / 2,
      750: 1,
      375: 2,
      828: 1.81 / 2
    },
    sourceRoot: 'src',
    outputRoot: 'dist',

    plugins: ['@tarojs/plugin-html', ['@tarojs/plugin-mini-ci', CIPluginOpt]],

    defineConstants: {
      ENV_HOME_URL: '"/pages/home/index"',
      /** webview的地址 */
      ENV_WEBVIEW_URL: '"/pages/sub-mine/web-page/index"',
      META_ENV_MAP: JSON.stringify({
        uat: uatConfig,
        stg: stgConfig,
        release: releaseConfig
      })
    },
    copy: {
      patterns: [],
      options: {}
    },
    framework: 'vue3',
    compiler: {
      type: 'webpack5',
      prebundle: { enable: false }
    },
    cache: {
      enable: false // Webpack 持久化缓存配置，建议开启。默认配置请参考：https://docs.taro.zone/docs/config-detail#cache
    },
    sass: {
      resource: [path.resolve(process.cwd(), 'src/styles/variables.scss')]
    },
    mini: {
      postcss: {
        pxtransform: {
          enable: true,
          config: {}
        },
        cssModules: {
          enable: false, // 默认为 false，如需使用 css modules 功能，则设为 true
          config: {
            namingPattern: 'module', // 转换模式，取值为 global/module
            generateScopedName: '[name]__[local]___[hash:base64:5]'
          }
        }
      },
      compile: {
        include: [
          (modulePath: string) => modulePath.indexOf(`${path.sep}packages${path.sep}ui`) >= 0,
          (modulePath: string) => modulePath.indexOf(`${path.sep}http-client`) >= 0,
          (modulePath: string) => modulePath.indexOf(`@mid-vue${path.sep}use`) >= 0,
          (modulePath: string) => modulePath.indexOf(`${path.sep}birpc`) >= 0
        ]
      },

      webpackChain(chain) {
        chain.resolve.plugin('tsconfig-paths').use(TsconfigPathsPlugin)
        chain.plugin('providerPlugin').tap((args: Array<any>) => {
          // args[0].$TzNotify = ['@tz-mall/weapp-ui', 'TzNotify']
          return args
        })
        chain.merge({
          plugin: {
            install: {
              plugin: UnifiedWebpackPluginV5,
              args: [
                {
                  appType: 'taro',
                  injectAdditionalCssVarScope: true
                }
              ]
            }
          }
        })
      }
    },
    h5: {
      publicPath: '/',
      staticDirectory: 'static',
      output: {
        filename: 'js/[name].[hash:8].js',
        chunkFilename: 'js/[name].[chunkhash:8].js'
      },
      miniCssExtractPluginOption: {
        ignoreOrder: true,
        filename: 'css/[name].[hash].css',
        chunkFilename: 'css/[name].[chunkhash].css'
      },
      postcss: {
        autoprefixer: {
          enable: true,
          config: {}
        },
        cssModules: {
          enable: false, // 默认为 false，如需使用 css modules 功能，则设为 true
          config: {
            namingPattern: 'module', // 转换模式，取值为 global/module
            generateScopedName: '[name]__[local]___[hash:base64:5]'
          }
        }
      },
      compile: {
        include: [
          (modulePath: string) => modulePath.indexOf(`${path.sep}packages${path.sep}ui`) >= 0,
          (modulePath: string) => modulePath.indexOf(`${path.sep}http-client`) >= 0,
          (modulePath: string) => modulePath.indexOf(`@mid-vue${path.sep}use`) >= 0,
          (modulePath: string) => modulePath.indexOf(`${path.sep}birpc`) >= 0
        ]
      },
      webpackChain(chain: any) {
        chain.resolve.plugin('tsconfig-paths').use(TsconfigPathsPlugin)
      }
    },
    rn: {
      appName: 'taroDemo',
      postcss: {
        cssModules: {
          enable: false // 默认为 false，如需使用 css modules 功能，则设为 true
        }
      }
    }
  }
  if (process.env.NODE_ENV === 'development') {
    // 本地开发构建配置（不混淆压缩）
    return merge({}, baseConfig, devConfig)
  }
  // 生产构建配置（默认开启压缩混淆等）
  return merge({}, baseConfig, prodConfig)
})
