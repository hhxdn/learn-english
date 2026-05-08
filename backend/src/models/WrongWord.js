const db = require('../config/database');

class WrongWord {
  // 添加错题记录
  static async add(wordData) {
    const { user_id = 'default_user', word_id, word, chinese, phonetic, level_id } = wordData;

    const sql = `
      INSERT INTO wrong_words (user_id, word_id, word, chinese, phonetic, level_id, wrong_count, last_wrong_time)
      VALUES (?, ?, ?, ?, ?, ?, 1, NOW())
      ON DUPLICATE KEY UPDATE
        wrong_count = wrong_count + 1,
        last_wrong_time = NOW()
    `;

    const [result] = await db.query(sql, [user_id, word_id, word, chinese, phonetic || '', level_id]);
    return result;
  }

  // 获取用户的错题列表
  static async getByUser(user_id = 'default_user', filters = {}) {
    const { level_id, page = 1, limit = 50 } = filters;
    const offset = (page - 1) * limit;

    let sql = 'SELECT * FROM wrong_words WHERE user_id = ?';
    const params = [user_id];

    if (level_id) {
      sql += ' AND level_id = ?';
      params.push(level_id);
    }

    sql += ' ORDER BY last_wrong_time DESC, wrong_count DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const [rows] = await db.query(sql, params);
    return rows;
  }

  // 获取错题总数
  static async getCount(user_id = 'default_user', level_id = null) {
    let sql = 'SELECT COUNT(*) as total FROM wrong_words WHERE user_id = ?';
    const params = [user_id];

    if (level_id) {
      sql += ' AND level_id = ?';
      params.push(level_id);
    }

    const [rows] = await db.query(sql, params);
    return rows[0].total;
  }

  // 删除错题记录
  static async delete(id, user_id = 'default_user') {
    const [result] = await db.query('DELETE FROM wrong_words WHERE id = ? AND user_id = ?', [id, user_id]);
    return result.affectedRows;
  }

  // 清空用户的错题本
  static async clearAll(user_id = 'default_user', level_id = null) {
    let sql = 'DELETE FROM wrong_words WHERE user_id = ?';
    const params = [user_id];

    if (level_id) {
      sql += ' AND level_id = ?';
      params.push(level_id);
    }

    const [result] = await db.query(sql, params);
    return result.affectedRows;
  }

  // 获取错题统计
  static async getStats(user_id = 'default_user') {
    const sql = `
      SELECT
        level_id,
        COUNT(*) as count,
        SUM(wrong_count) as total_wrong_count
      FROM wrong_words
      WHERE user_id = ?
      GROUP BY level_id
    `;

    const [rows] = await db.query(sql, [user_id]);
    return rows;
  }
}

module.exports = WrongWord;
