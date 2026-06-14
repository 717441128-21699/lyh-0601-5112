export default defineAppConfig({
  pages: [
    'pages/home/index',
    'pages/footprint/index',
    'pages/discover/index',
    'pages/stats/index',
    'pages/mine/index',
    'pages/footprint-detail/index',
    'pages/add-footprint/index',
    'pages/destination-detail/index',
    'pages/challenge-detail/index',
    'pages/monthly-report/index',
    'pages/profile/index',
    'pages/admin/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#2D7FF9',
    navigationBarTitleText: '旅行足迹',
    navigationBarTextStyle: 'white'
  },
  tabBar: {
    color: '#86909C',
    selectedColor: '#2D7FF9',
    backgroundColor: '#FFFFFF',
    borderStyle: 'black',
    list: [
      {
        pagePath: 'pages/home/index',
        text: '首页'
      },
      {
        pagePath: 'pages/footprint/index',
        text: '足迹'
      },
      {
        pagePath: 'pages/discover/index',
        text: '发现'
      },
      {
        pagePath: 'pages/stats/index',
        text: '统计'
      },
      {
        pagePath: 'pages/mine/index',
        text: '我的'
      }
    ]
  }
})
