const { levelConfig } = require('../../data/words.js');
const { formatTime } = require('../../utils/game.js');

Page({
  data: {
    correct: 0,
    wrong: 0,
    time: 0,
    level: '',
    levelName: '',
    timeText: '',
    accuracy: 0,
    resultIcon: '',
    resultTitle: '',
    ratingText: '',
    stars: []
  },

  onLoad(options) {
    const correct = parseInt(options.correct) || 0;
    const wrong = parseInt(options.wrong) || 0;
    const time = parseInt(options.time) || 0;
    const level = options.level || 'primary';
    const total = correct + wrong;
    const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;

    const config = levelConfig[level];
    const rating = this.calculateRating(accuracy);

    this.setData({
      correct,
      wrong,
      time,
      level,
      levelName: config.name,
      timeText: formatTime(time),
      accuracy,
      ...rating
    });
  },

  calculateRating(accuracy) {
    let resultIcon, resultTitle, ratingText, stars;

    if (accuracy >= 90) {
      resultIcon = '🏆';
      resultTitle = '完美抓捕！';
      ratingText = '你是单词大师！';
      stars = ['⭐', '⭐', '⭐'];
    } else if (accuracy >= 70) {
      resultIcon = '🎉';
      resultTitle = '成功抓捕！';
      ratingText = '表现不错，继续加油！';
      stars = ['⭐', '⭐', '☆'];
    } else if (accuracy >= 50) {
      resultIcon = '👍';
      resultTitle = '勉强抓到！';
      ratingText = '还需要多练习哦！';
      stars = ['⭐', '☆', '☆'];
    } else {
      resultIcon = '😅';
      resultTitle = '小偷逃跑了！';
      ratingText = '别灰心，再试一次！';
      stars = ['☆', '☆', '☆'];
    }

    return { resultIcon, resultTitle, ratingText, stars };
  },

  playAgain() {
    wx.redirectTo({
      url: `/pages/game/game?level=${this.data.level}`
    });
  },

  backToHome() {
    wx.redirectTo({
      url: '/pages/index/index'
    });
  }
});
