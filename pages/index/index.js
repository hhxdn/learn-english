const { levelConfig } = require('../../data/words.js');

Page({
  data: {
    levels: []
  },

  onLoad() {
    // 转换等级配置为数组
    const levels = Object.keys(levelConfig).map(key => ({
      id: key,
      ...levelConfig[key]
    }));
    this.setData({ levels });
  },

  selectLevel(e) {
    const level = e.currentTarget.dataset.level;
    wx.navigateTo({
      url: `/pages/game/game?level=${level}`
    });
  }
});
