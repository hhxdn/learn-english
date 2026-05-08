const api = require('./utils/api.js');

App({
  onLaunch() {
    // 初始化应用
    console.log('英语单词追捕小程序启动');
    this.initUser();
  },

  // 初始化用户
  async initUser() {
    try {
      // 使用默认用户ID（实际项目中应该使用微信登录获取openid）
      const openid = 'default_user';

      // 尝试从缓存获取用户信息
      let userInfo = wx.getStorageSync('userInfo');

      if (!userInfo || userInfo.openid !== openid) {
        // 登录获取用户信息
        userInfo = await api.userLogin(openid, {
          nickname: '学习者',
          avatar_url: ''
        });

        // 缓存用户信息
        wx.setStorageSync('userInfo', userInfo);
      }

      this.globalData.userInfo = userInfo;
      this.globalData.openid = openid;

    } catch (error) {
      console.error('初始化用户失败:', error);
      // 使用默认值
      this.globalData.openid = 'default_user';
    }
  },

  globalData: {
    userLevel: '',
    currentScore: 0,
    openid: 'default_user',
    userInfo: null
  }
})
