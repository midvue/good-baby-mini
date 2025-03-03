export default {
  pages: [
    'pages/home/index',
    'pages/mine/index', // 我的
    'pages/login/index',
    'pages/feed-milk/index'
  ],
  subpackages: [
    {
      //sub 用户中心子包
      root: 'pages/sub-mine',
      pages: ['web-page/index']
    }
  ],
  preloadRule: {
    'pages/mine/index': {
      packages: ['pages/sub-mine']
    }
  },
  window: {
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'WeChat',
    navigationBarTextStyle: 'black',
    backgroundTextStyle: 'light',
    backgroundColor: '#fff'
  },
  lazyCodeLoading: 'requiredComponents',
  tabBar: {
    color: '#524D63',
    selectedColor: '#8365F6',
    backgroundColor: '#FFFFFF',
    borderStyle: 'white',
    position: 'bottom',
    list: [
      {
        pagePath: 'pages/home/index',
        text: '喂养',
        selectedIconPath: 'assets/images/ic_order_create_active.png',
        iconPath: 'assets/images/ic_order_create.png'
      },
      {
        pagePath: 'pages/mine/index',
        text: '我的',
        selectedIconPath: 'assets/images/ic_user_active.png',
        iconPath: 'assets/images/ic_user.png'
      }
    ]
  }
}
