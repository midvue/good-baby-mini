export default {
  pages: [
    'pages/home/index',
    'pages/mine/index' // 我的
  ],
  subpackages: [
    {
      //sub 喂养子包
      root: 'pages/sub-home',
      pages: ['feed-milk/index', 'baby-manage/index', 'diapering/index', 'height-weight/index']
    },
    {
      //sub 用户中心子包
      root: 'pages/sub-mine',
      pages: ['web-page/index', 'family-manage/index', 'about-me/index']
    }
  ],
  preloadRule: {
    'pages/home/index': {
      packages: ['pages/sub-home'],
      network: 'all'
    },
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
    color: '#AFA8BC',
    selectedColor: '#FF5D9E',
    backgroundColor: '#FFFFFF',
    borderStyle: 'white',
    position: 'bottom',
    custom: true,
    list: [
      {
        pagePath: 'pages/home/index',
        text: '喂养',
        selectedIconPath: 'assets/images/icon_home_active.png',
        iconPath: 'assets/images/icon_home.png'
      },
      {
        pagePath: 'pages/mine/index',
        text: '我的',
        selectedIconPath: 'assets/images/icon_mine_active.png',
        iconPath: 'assets/images/icon_mine.png'
      }
    ]
  }
}
