// 游戏工具函数
const { wordDatabase } = require('../data/words.js');

/**
 * 获取指定等级的随机单词列表
 */
function getRandomWords(level, count) {
  const words = wordDatabase[level] || [];
  const shuffled = [...words].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

/**
 * 计算距离百分比
 */
function calculateDistance(current, total) {
  return Math.round((current / total) * 100);
}

/**
 * 检查答案是否正确
 */
function checkAnswer(userInput, correctWord) {
  return userInput.toLowerCase().trim() === correctWord.toLowerCase().trim();
}

/**
 * 格式化时间
 */
function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

module.exports = {
  getRandomWords,
  calculateDistance,
  checkAnswer,
  formatTime
};
