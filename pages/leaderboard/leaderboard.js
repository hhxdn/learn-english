const api = require('../../utils/api.js');

Page({
  data: {
    currentTab: 0,
    tabs: ['总排行', '小学', '初中', '高中', '四级', '六级'],
    levelIds: ['', 'primary', 'middle', 'high', 'cet4', 'cet6'],
    leaderboard: [],
    loading: true,
    myRank: null
  },

  onLoad() {
    this.loadLeaderboard();
  },

  switchTab(e) {
    const index = e.currentTarget.dataset.index;
    this.setData({
      currentTab: index
    });
    this.loadLeaderboard();
  },

  async loadLeaderboard() {
    try {
      wx.showLoading({ title: '加载中...' });
      const { currentTab, levelIds } = this.data;

      let leaderboard;

      if (currentTab === 0) {
        // 总排行榜
        leaderboard = await api.getLeaderboard(100, 'best_accuracy');
      } else {
        // 等级排行榜
        const levelId = levelIds[currentTab];
        leaderboard = await api.getLevelLeaderboard(levelId, 50);
      }

      // 获取当前用户排名
      const app = getApp();
      const openid = app.globalData.openid || 'default_user';
      const myRank = leaderboard.findIndex(item => item.openid === openid) + 1;

      this.setData({
        leaderboard,
        myRank: myRank > 0 ? myRank : null,
        loading: false
      });
    } catch (error) {
      console.error('加载排行榜失败:', error);
      wx.showToast({
        title: '加载失败',
        icon: 'none'
      });
    } finally {
      wx.hideLoading();
    }
  },

  onPullDownRefresh() {
    this.loadLeaderboard().then(() => {
      wx.stopPullDownRefresh();
    });
  }
});
