const { getRandomWords, calculateDistance, checkAnswer, formatTime } = require('../../utils/game.js');
const { levelConfig } = require('../../data/words.js');

Page({
  data: {
    level: '',
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
    timeText: '00:00'
  },

  timer: null,

  onLoad(options) {
    const level = options.level || 'primary';
    const config = levelConfig[level];
    const words = getRandomWords(level, config.wordCount);

    this.setData({
      level,
      words,
      totalWords: words.length,
      currentWord: words[0] || {},
      startTime: Date.now()
    });

    wx.setNavigationBarTitle({
      title: `${config.name} - 追捕小偷`
    });

    this.startTimer();
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
    const newIndex = currentIndex + 1;
    const newPosition = calculateDistance(newIndex, totalWords);

    if (isCorrect) {
      // 答对了，前进
      const newCorrectCount = correctCount + 1;

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
      // 答错了，显示正确答案但仍然前进
      const newWrongCount = wrongCount + 1;

      this.setData({
        wrongCount: newWrongCount,
        policePosition: newPosition,
        distance: 100 - newPosition
      });

      this.showHint(`✗ 错误！正确答案是: ${currentWord.word}`, 'error');

      // 继续下一题
      setTimeout(() => {
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

  gameComplete() {
    if (this.timer) {
      clearInterval(this.timer);
    }

    const { correctCount, wrongCount, timeText, level } = this.data;
    const totalTime = Math.floor((Date.now() - this.data.startTime) / 1000);

    wx.redirectTo({
      url: `/pages/result/result?correct=${correctCount}&wrong=${wrongCount}&time=${totalTime}&level=${level}`
    });
  }
});
