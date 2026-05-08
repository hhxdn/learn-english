const api = require('../../utils/api.js');

Page({
  data: {
    levels: [],
    loading: true
  },

  onLoad() {
    this.loadLevels();
  },

  async loadLevels() {
    try {
      wx.showLoading({ title: '加载中...' });
      const levels = await api.getLevels();
      this.setData({
        levels,
        loading: false
      });
    } catch (error) {
      console.error('加载等级失败:', error);
      wx.showToast({
        title: '加载失败',
        icon: 'none'
      });
      // 如果API失败，使用本地数据作为备用
      this.loadLocalLevels();
    } finally {
      wx.hideLoading();
    }
  },

  loadLocalLevels() {
    const { levelConfig } = require('../../data/words.js');
    const levels = Object.keys(levelConfig).map(key => ({
      id: key,
      ...levelConfig[key]
    }));
    this.setData({ levels, loading: false });
  },

  selectLevel(e) {
    const level = e.currentTarget.dataset.level;
    wx.navigateTo({
      url: `/pages/game/game?level=${level}`
    });
  }
});
