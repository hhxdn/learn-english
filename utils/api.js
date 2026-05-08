// API配置
const API_BASE_URL = 'http://localhost:3000/api';

// 请求封装
function request(url, options = {}) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${API_BASE_URL}${url}`,
      method: options.method || 'GET',
      data: options.data || {},
      header: {
        'content-type': 'application/json'
      },
      success(res) {
        if (res.statusCode === 200 && res.data.code === 200) {
          resolve(res.data.data);
        } else {
          reject(res.data.message || '请求失败');
        }
      },
      fail(err) {
        reject(err.errMsg || '网络错误');
      }
    });
  });
}

// API接口
const api = {
  // 获取等级列表
  getLevels() {
    return request('/levels');
  },

  // 获取随机单词
  getRandomWords(level_id, count = 10) {
    return request(`/words/random?level_id=${level_id}&count=${count}`);
  },

  // 添加错题
  addWrongWord(wordData) {
    return request('/wrong-words', {
      method: 'POST',
      data: wordData
    });
  },

  // 获取错题列表
  getWrongWords(level_id = '', page = 1, limit = 50) {
    let url = `/wrong-words?page=${page}&limit=${limit}`;
    if (level_id) {
      url += `&level_id=${level_id}`;
    }
    return request(url);
  },

  // 获取错题统计
  getWrongWordsStats() {
    return request('/wrong-words/stats');
  },

  // 删除错题
  deleteWrongWord(id) {
    return request(`/wrong-words/${id}`, {
      method: 'DELETE'
    });
  },

  // 清空错题本
  clearWrongWords(level_id = '') {
    return request('/wrong-words/clear', {
      method: 'POST',
      data: { level_id }
    });
  },

  // 用户登录
  userLogin(openid, userInfo = {}) {
    return request('/users/login', {
      method: 'POST',
      data: { openid, ...userInfo }
    });
  },

  // 获取用户信息
  getUserInfo(openid) {
    return request(`/users/info?openid=${openid}`);
  },

  // 提交游戏记录
  submitGameRecord(recordData) {
    return request('/game-records', {
      method: 'POST',
      data: recordData
    });
  },

  // 获取用户游戏记录
  getUserRecords(openid, level_id = '', page = 1) {
    let url = `/game-records?openid=${openid}&page=${page}`;
    if (level_id) {
      url += `&level_id=${level_id}`;
    }
    return request(url);
  },

  // 获取排行榜
  getLeaderboard(limit = 100, order_by = 'best_accuracy') {
    return request(`/users/leaderboard?limit=${limit}&order_by=${order_by}`);
  },

  // 获取等级排行榜
  getLevelLeaderboard(level_id, limit = 50) {
    return request(`/game-records/leaderboard?level_id=${level_id}&limit=${limit}`);
  },

  // 获取今日挑战
  getTodayChallenge(openid) {
    return request(`/daily-challenges/today?openid=${openid}`);
  },

  // 提交挑战记录
  submitChallenge(challengeData) {
    return request('/daily-challenges/submit', {
      method: 'POST',
      data: challengeData
    });
  },

  // 获取挑战排行榜
  getChallengeLeaderboard(limit = 50) {
    return request(`/daily-challenges/leaderboard?limit=${limit}`);
  },

  // 获取用户挑战历史
  getChallengeHistory(openid, limit = 30) {
    return request(`/daily-challenges/history?openid=${openid}&limit=${limit}`);
  }
};

module.exports = api;
