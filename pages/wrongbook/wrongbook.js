const api = require('../../utils/api.js');

Page({
  data: {
    wrongWords: [],
    levels: [],
    currentLevel: '',
    loading: true,
    stats: []
  },

  onLoad() {
    this.loadLevels();
    this.loadStats();
    this.loadWrongWords();
  },

  async loadLevels() {
    try {
      const levels = await api.getLevels();
      this.setData({ levels });
    } catch (error) {
      console.error('加载等级失败:', error);
    }
  },

  async loadStats() {
    try {
      const app = getApp();
      const user_id = app.globalData.openid || 'default_user';
      const stats = await api.getWrongWordsStats(user_id);
      this.setData({ stats });
    } catch (error) {
      console.error('加载统计失败:', error);
    }
  },

  async loadWrongWords() {
    try {
      wx.showLoading({ title: '加载中...' });
      const app = getApp();
      const user_id = app.globalData.openid || 'default_user';
      const { currentLevel } = this.data;
      const data = await api.getWrongWords(user_id, currentLevel);
      this.setData({
        wrongWords: data.list,
        loading: false
      });
    } catch (error) {
      console.error('加载错题失败:', error);
      wx.showToast({
        title: '加载失败',
        icon: 'none'
      });
    } finally {
      wx.hideLoading();
    }
  },

  onLevelChange(e) {
    this.setData({
      currentLevel: e.detail.value
    });
    this.loadWrongWords();
  },

  async deleteWord(e) {
    const { id } = e.currentTarget.dataset;

    const res = await wx.showModal({
      title: '确认删除',
      content: '确定要从错题本中删除这个单词吗？'
    });

    if (!res.confirm) return;

    try {
      await api.deleteWrongWord(id);
      wx.showToast({
        title: '删除成功',
        icon: 'success'
      });
      this.loadWrongWords();
      this.loadStats();
    } catch (error) {
      console.error('删除失败:', error);
      wx.showToast({
        title: '删除失败',
        icon: 'none'
      });
    }
  },

  async clearAll() {
    const res = await wx.showModal({
      title: '确认清空',
      content: '确定要清空所有错题吗？此操作不可恢复！',
      confirmText: '清空',
      confirmColor: '#f56565'
    });

    if (!res.confirm) return;

    try {
      const app = getApp();
      const user_id = app.globalData.openid || 'default_user';
      const { currentLevel } = this.data;
      await api.clearWrongWords(user_id, currentLevel);
      wx.showToast({
        title: '清空成功',
        icon: 'success'
      });
      this.loadWrongWords();
      this.loadStats();
    } catch (error) {
      console.error('清空失败:', error);
      wx.showToast({
        title: '清空失败',
        icon: 'none'
      });
    }
  },

  practiceWrongWords() {
    const { wrongWords } = this.data;
    if (wrongWords.length === 0) {
      wx.showToast({
        title: '暂无错题',
        icon: 'none'
      });
      return;
    }

    // 将错题转换为游戏格式并跳转
    wx.navigateTo({
      url: '/pages/game/game?mode=wrong&level=wrong'
    });
  }
});
