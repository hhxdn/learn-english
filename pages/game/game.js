const { calculateDistance, checkAnswer, formatTime } = require('../../utils/game.js');
const api = require('../../utils/api.js');

Page({
  data: {
    level: '',
    levelName: '',
    words: [],
    currentIndex: 0,
    currentWord: {},
    totalWords: 0,
    userInput: '',
    correctCount: 0,
    wrongCount: 0,
    policePosition: 0,
    distance: 100,
    hintMessage: '',
    hintType: '',
    inputFocus: true,
    startTime: 0,
    timeText: '00:00',
    mode: 'normal', // normal 或 challenge
    challengeId: null,
    timeLimit: 0
  },

  timer: null,

  async onLoad(options) {
    const level = options.level || 'primary';
    const mode = options.mode || 'normal';
    const challengeId = options.challenge_id || null;
    const wordCount = parseInt(options.word_count) || 0;
    const timeLimit = parseInt(options.time_limit) || 0;

    try {
      wx.showLoading({ title: '加载中...' });

      // 从API获取等级信息
      const levels = await api.getLevels();
      const levelInfo = levels.find(l => l.id === level);

      if (!levelInfo) {
        throw new Error('等级不存在');
      }

      // 从API获取随机单词
      const count = mode === 'challenge' && wordCount > 0 ? wordCount : levelInfo.word_count;
      const words = await api.getRandomWords(level, count);

      if (!words || words.length === 0) {
        throw new Error('该等级暂无单词');
      }

      this.setData({
        level,
        levelName: levelInfo.name,
        mode,
        challengeId,
        timeLimit,
        words,
        totalWords: words.length,
        currentWord: words[0],
        startTime: Date.now()
      });

      wx.setNavigationBarTitle({
        title: `${levelInfo.name} - 追捕小偷`
      });

      this.startTimer();
    } catch (error) {
      console.error('加载游戏数据失败:', error);
      wx.showModal({
        title: '加载失败',
        content: error.message || '无法加载游戏数据，请检查网络连接',
        showCancel: false,
        success: () => {
          wx.navigateBack();
        }
      });
    } finally {
      wx.hideLoading();
    }
  },

  onUnload() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  },

  startTimer() {
    this.timer = setInterval(() => {
      const elapsed = Math.floor((Date.now() - this.data.startTime) / 1000);
      this.setData({
        timeText: formatTime(elapsed)
      });
    }, 1000);
  },

  onInput(e) {
    this.setData({
      userInput: e.detail.value
    });
  },

  submitAnswer() {
    const { userInput, currentWord, currentIndex, words, correctCount, wrongCount, totalWords } = this.data;

    if (!userInput.trim()) {
      this.showHint('请输入单词！', 'warning');
      return;
    }

    const isCorrect = checkAnswer(userInput, currentWord.word);

    if (isCorrect) {
      // 答对了，前进
      const newCorrectCount = correctCount + 1;
      const newIndex = currentIndex + 1;
      const newPosition = calculateDistance(newIndex, totalWords);

      this.setData({
        correctCount: newCorrectCount,
        policePosition: newPosition,
        distance: 100 - newPosition
      });

      this.showHint('✓ 正确！警察靠近了！', 'success');

      // 检查是否完成
      if (newIndex >= totalWords) {
        setTimeout(() => {
          this.gameComplete();
        }, 1000);
      } else {
        // 下一题
        setTimeout(() => {
          this.nextWord(newIndex);
        }, 800);
      }
    } else {
      // 答错了，显示正确答案
      const newWrongCount = wrongCount + 1;
      this.setData({
        wrongCount: newWrongCount
      });

      this.showHint(`✗ 错误！正确答案是: ${currentWord.word}`, 'error');

      // 添加到错题本
      this.addToWrongBook(currentWord);

      // 继续下一题
      setTimeout(() => {
        const newIndex = currentIndex + 1;
        if (newIndex >= totalWords) {
          this.gameComplete();
        } else {
          this.nextWord(newIndex);
        }
      }, 2000);
    }
  },

  nextWord(index) {
    this.setData({
      currentIndex: index,
      currentWord: this.data.words[index],
      userInput: '',
      hintMessage: '',
      inputFocus: true
    });
  },

  showHint(message, type) {
    this.setData({
      hintMessage: message,
      hintType: type
    });
  },

  // 语音朗读单词
  speakWord() {
    const { currentWord } = this.data;
    if (!currentWord.word) return;

    // 使用微信内置的语音合成API
    wx.showLoading({ title: '朗读中...' });

    const innerAudioContext = wx.createInnerAudioContext();

    // 使用有道词典API或其他TTS服务
    // 这里使用微信的插件或者第三方API
    // 简单实现：使用系统TTS（需要插件支持）

    // 方案1：使用微信插件（需要在app.json中配置）
    // 方案2：调用后端API，后端调用TTS服务
    // 方案3：使用第三方小程序插件

    // 这里先用简单的提示，实际项目中需要接入TTS服务
    wx.hideLoading();
    wx.showToast({
      title: `朗读: ${currentWord.word}`,
      icon: 'none',
      duration: 1500
    });

    // TODO: 接入真实的TTS服务
    // 可以调用后端API，后端使用百度TTS、讯飞TTS等服务
  },

  // 添加到错题本
  async addToWrongBook(word) {
    try {
      const app = getApp();
      const user_id = app.globalData.openid || 'default_user';

      await api.addWrongWord({
        user_id,
        word_id: word.id || 0,
        word: word.word,
        chinese: word.chinese,
        phonetic: word.phonetic || '',
        level_id: this.data.level
      });
    } catch (error) {
      console.error('添加错题失败:', error);
      // 静默失败，不影响游戏流程
    }
  },

  async gameComplete() {
    if (this.timer) {
      clearInterval(this.timer);
    }

    const { correctCount, wrongCount, level, mode, challengeId, totalWords } = this.data;
    const totalTime = Math.floor((Date.now() - this.data.startTime) / 1000);
    const app = getApp();
    const openid = app.globalData.openid || 'default_user';

    // 提交游戏记录
    try {
      await api.submitGameRecord({
        openid,
        level_id: level,
        correct_count: correctCount,
        wrong_count: wrongCount,
        time_spent: totalTime
      });
    } catch (error) {
      console.error('提交游戏记录失败:', error);
    }

    // 如果是挑战模式，提交挑战记录
    if (mode === 'challenge' && challengeId) {
      try {
        const user = app.globalData.userInfo;
        const completed = correctCount === totalWords; // 全部答对才算完成

        await api.submitChallenge({
          challenge_id: parseInt(challengeId),
          openid,
          correct_count: correctCount,
          wrong_count: wrongCount,
          time_spent: totalTime,
          completed
        });
      } catch (error) {
        console.error('提交挑战记录失败:', error);
      }
    }

    wx.redirectTo({
      url: `/pages/result/result?correct=${correctCount}&wrong=${wrongCount}&time=${totalTime}&level=${level}&mode=${mode}`
    });
  }
});
