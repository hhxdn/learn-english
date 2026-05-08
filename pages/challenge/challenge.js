const api = require('../../utils/api.js');

Page({
  data: {
    challenge: null,
    userStatus: null,
    loading: true,
    canStart: false,
    leaderboard: [],
    showLeaderboard: false
  },

  onLoad() {
    this.loadChallenge();
  },

  async loadChallenge() {
    try {
      wx.showLoading({ title: '加载中...' });
      const app = getApp();
      const openid = app.globalData.openid || 'default_user';

      const data = await api.getTodayChallenge(openid);

      this.setData({
        challenge: data.challenge,
        userStatus: data.user_status,
        canStart: !data.user_status || !data.user_status.completed,
        loading: false
      });
    } catch (error) {
      console.error('加载挑战失败:', error);
      wx.showToast({
        title: '加载失败',
        icon: 'none'
      });
    } finally {
      wx.hideLoading();
    }
  },

  startChallenge() {
    const { challenge, canStart } = this.data;

    if (!canStart) {
      wx.showToast({
        title: '今日已完成挑战',
        icon: 'none'
      });
      return;
    }

    if (!challenge) {
      wx.showToast({
        title: '挑战未生成',
        icon: 'none'
      });
      return;
    }

    // 跳转到游戏页面，传递挑战参数
    wx.navigateTo({
      url: `/pages/game/game?level=${challenge.level_id}&mode=challenge&challenge_id=${challenge.id}&word_count=${challenge.word_count}&time_limit=${challenge.time_limit}`
    });
  },

  async showLeaderboardPanel() {
    try {
      wx.showLoading({ title: '加载中...' });
      const leaderboard = await api.getChallengeLeaderboard(50);

      this.setData({
        leaderboard,
        showLeaderboard: true
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

  hideLeaderboard() {
    this.setData({
      showLeaderboard: false
    });
  }
});
