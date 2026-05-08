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
  }
};

module.exports = api;
