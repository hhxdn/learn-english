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
  }
};

module.exports = api;
