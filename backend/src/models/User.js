const db = require('../config/database');

class User {
  // 根据OpenID获取或创建用户
  static async getOrCreate(openid, userInfo = {}) {
    // 先查询用户是否存在
    const [rows] = await db.query('SELECT * FROM users WHERE openid = ?', [openid]);

    if (rows.length > 0) {
      return rows[0];
    }

    // 不存在则创建
    const { nickname = '学习者', avatar_url = '' } = userInfo;
    const sql = 'INSERT INTO users (openid, nickname, avatar_url) VALUES (?, ?, ?)';
    const [result] = await db.query(sql, [openid, nickname, avatar_url]);

    return {
      id: result.insertId,
      openid,
      nickname,
      avatar_url,
      total_games: 0,
      total_correct: 0,
      total_wrong: 0,
      best_accuracy: 0,
      total_time: 0
    };
  }

  // 根据ID获取用户
  static async getById(id) {
    const [rows] = await db.query('SELECT * FROM users WHERE id = ?', [id]);
    return rows[0];
  }

  // 根据OpenID获取用户
  static async getByOpenId(openid) {
    const [rows] = await db.query('SELECT * FROM users WHERE openid = ?', [openid]);
    return rows[0];
  }

  // 更新用户信息
  static async update(id, data) {
    const { nickname, avatar_url } = data;
    const sql = 'UPDATE users SET nickname = ?, avatar_url = ? WHERE id = ?';
    const [result] = await db.query(sql, [nickname, avatar_url, id]);
    return result.affectedRows;
  }

  // 更新用户统计数据
  static async updateStats(openid, gameData) {
    const { correct_count, wrong_count, time_spent, accuracy } = gameData;

    const sql = `
      UPDATE users SET
        total_games = total_games + 1,
        total_correct = total_correct + ?,
        total_wrong = total_wrong + ?,
        total_time = total_time + ?,
        best_accuracy = GREATEST(best_accuracy, ?)
      WHERE openid = ?
    `;

    const [result] = await db.query(sql, [correct_count, wrong_count, time_spent, accuracy, openid]);
    return result.affectedRows;
  }

  // 获取用户排名
  static async getRanking(openid) {
    const sql = `
      SELECT COUNT(*) + 1 as ranking
      FROM users
      WHERE best_accuracy > (SELECT best_accuracy FROM users WHERE openid = ?)
    `;

    const [rows] = await db.query(sql, [openid]);
    return rows[0].ranking;
  }

  // 获取排行榜
  static async getLeaderboard(limit = 100, orderBy = 'best_accuracy') {
    const validOrderBy = ['best_accuracy', 'total_games', 'total_correct'];
    const order = validOrderBy.includes(orderBy) ? orderBy : 'best_accuracy';

    const sql = `
      SELECT
        id,
        openid,
        nickname,
        avatar_url,
        total_games,
        total_correct,
        total_wrong,
        best_accuracy,
        total_time
      FROM users
      WHERE total_games > 0
      ORDER BY ${order} DESC, total_games DESC
      LIMIT ?
    `;

    const [rows] = await db.query(sql, [limit]);
    return rows;
  }
}

module.exports = User;
