const db = require('../config/database');

class GameRecord {
  // 创建游戏记录
  static async create(recordData) {
    const {
      user_id,
      openid,
      level_id,
      correct_count,
      wrong_count,
      total_count,
      accuracy,
      time_spent,
      score
    } = recordData;

    const sql = `
      INSERT INTO game_records
      (user_id, openid, level_id, correct_count, wrong_count, total_count, accuracy, time_spent, score)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const [result] = await db.query(sql, [
      user_id,
      openid,
      level_id,
      correct_count,
      wrong_count,
      total_count,
      accuracy,
      time_spent,
      score
    ]);

    return result.insertId;
  }

  // 获取用户的游戏记录
  static async getByUser(openid, filters = {}) {
    const { level_id, page = 1, limit = 20 } = filters;
    const offset = (page - 1) * limit;

    let sql = 'SELECT * FROM game_records WHERE openid = ?';
    const params = [openid];

    if (level_id) {
      sql += ' AND level_id = ?';
      params.push(level_id);
    }

    sql += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const [rows] = await db.query(sql, params);
    return rows;
  }

  // 获取用户记录总数
  static async getCount(openid, level_id = null) {
    let sql = 'SELECT COUNT(*) as total FROM game_records WHERE openid = ?';
    const params = [openid];

    if (level_id) {
      sql += ' AND level_id = ?';
      params.push(level_id);
    }

    const [rows] = await db.query(sql, params);
    return rows[0].total;
  }

  // 获取用户最佳成绩
  static async getBestRecord(openid, level_id) {
    const sql = `
      SELECT * FROM game_records
      WHERE openid = ? AND level_id = ?
      ORDER BY accuracy DESC, time_spent ASC
      LIMIT 1
    `;

    const [rows] = await db.query(sql, [openid, level_id]);
    return rows[0];
  }

  // 获取等级排行榜
  static async getLevelLeaderboard(level_id, limit = 50) {
    const sql = `
      SELECT
        gr.openid,
        u.nickname,
        u.avatar_url,
        MAX(gr.accuracy) as best_accuracy,
        MIN(gr.time_spent) as best_time,
        MAX(gr.score) as best_score,
        COUNT(*) as play_count
      FROM game_records gr
      LEFT JOIN users u ON gr.openid = u.openid
      WHERE gr.level_id = ?
      GROUP BY gr.openid, u.nickname, u.avatar_url
      ORDER BY best_accuracy DESC, best_time ASC
      LIMIT ?
    `;

    const [rows] = await db.query(sql, [level_id, limit]);
    return rows;
  }

  // 获取今日游戏统计
  static async getTodayStats(openid) {
    const sql = `
      SELECT
        COUNT(*) as games_today,
        SUM(correct_count) as correct_today,
        SUM(wrong_count) as wrong_today,
        SUM(time_spent) as time_today
      FROM game_records
      WHERE openid = ? AND DATE(created_at) = CURDATE()
    `;

    const [rows] = await db.query(sql, [openid]);
    return rows[0];
  }
}

module.exports = GameRecord;
