import Taro from '@tarojs/taro'

/** 处理版本跟新 */
export let useUpdateManager = () => {
  if (Taro.getEnv() === Taro.ENV_TYPE.WEB) return
  // 入口组件不需要实现 render 方法，即使实现了也会被 taro 所覆盖
  const updateManager = Taro.getUpdateManager()
  updateManager.onCheckForUpdate(function (res) {
    // 请求完新版本信息的回调
    console.log('是否有新版本', res.hasUpdate)
  })
  updateManager.onUpdateReady(function () {
    Taro.showModal({
      title: '更新提示',
      content: '新版本已经准备好，是否重启应用？',
      confirmColor: '#8365F6',
      success: function (res) {
        if (res.confirm) {
          // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
          updateManager.applyUpdate()
        }
      }
    })
  })
  updateManager.onUpdateFailed(function () {
    Taro.showToast({
      title: '更新失败',
      icon: 'none',
      duration: 3000
    })
  })
}
