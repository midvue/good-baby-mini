import path from 'node:path'
import { defineConfig, type UserConfigExport } from '@tarojs/cli'
import TsconfigPathsPlugin from 'tsconfig-paths-webpack-plugin'
import { UnifiedWebpackPluginV5 } from 'weapp-tailwindcss/webpack'
import devConfig from './dev'
import prodConfig from './prod'
import devEnvConfig from './env/dev'
import releaseConfig from './env/release'

/**
 * @typedef { import("@tarojs/plugin-mini-ci").CIOptions } CIOptions
 * @type {CIOptions}
 */
const CIPluginOpt = {
  weapp: {
    appid: 'wx7dfdbaaa00ca7246',
    privateKeyPath: 'config/private.wx7dfdbaaa00ca7246.key'
  },
  version: '2.0.3',
  desc: '机器人自动发布'
}

export default defineConfig<'webpack5'>(async (merge) => {
  const baseConfig: UserConfigExport<'webpack5'> = {
    projectName: 'good-baby-mini',
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
      ENV_WEBVIEW_URL: '"/pages/sub-mine/web-page/index"',
      ENV_CDN_BASE: '"https://cos-app.xfy-66.com/good-baby-mini/"',
      META_ENV_MAP: JSON.stringify({
        develop: devEnvConfig,
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
      enable: false
    },

    mini: {
      imageUrlLoaderOption: {
        limit: 1024
      },
      postcss: {
        pxtransform: {
          enable: true,
          config: {}
        },
        cssModules: {
          enable: false,
          config: {
            namingPattern: 'module',
            generateScopedName: '[name]__[local]___[hash:base64:5]'
          }
        }
      },
      compile: {
        include: [
          (modulePath: string) => modulePath.indexOf(`${path.sep}packages${path.sep}ui`) >= 0,
          (modulePath: string) => modulePath.indexOf(`${path.sep}http-client`) >= 0,
          (modulePath: string) => modulePath.indexOf(`@allkit${path.sep}use`) >= 0,
          (modulePath: string) => modulePath.indexOf(`@allkit${path.sep}shared`) >= 0,
          (modulePath: string) => modulePath.indexOf(`${path.sep}birpc`) >= 0
        ]
      },

      webpackChain(chain) {
        chain.resolve.plugin('tsconfig-paths').use(TsconfigPathsPlugin)
        chain.plugin('providerPlugin').tap((args: Array<any>) => {
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
      imageUrlLoaderOption: {
        limit: 1024
      },
      postcss: {
        autoprefixer: {
          enable: true,
          config: {}
        },
        cssModules: {
          enable: false,
          config: {
            namingPattern: 'module',
            generateScopedName: '[name]__[local]___[hash:base64:5]'
          }
        }
      },
      compile: {
        include: [
          (modulePath: string) => modulePath.indexOf(`${path.sep}packages${path.sep}ui`) >= 0,
          (modulePath: string) => modulePath.indexOf(`${path.sep}http-client`) >= 0,
          (modulePath: string) => modulePath.indexOf(`@allkit${path.sep}use`) >= 0,
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
          enable: false
        }
      }
    }
  }
  if (process.env.NODE_ENV === 'development') {
    return merge({}, baseConfig, devConfig)
  }
  return merge({}, baseConfig, prodConfig)
})
