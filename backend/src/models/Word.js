const db = require('../config/database');

class Word {
  // 获取所有单词（支持分页和筛选）
  static async getAll(filters = {}) {
    const { level_id, page = 1, limit = 50, keyword = '' } = filters;
    const offset = (page - 1) * limit;

    let sql = 'SELECT * FROM words WHERE 1=1';
    const params = [];

    if (level_id) {
      sql += ' AND level_id = ?';
      params.push(level_id);
    }

    if (keyword) {
      sql += ' AND (word LIKE ? OR chinese LIKE ?)';
      params.push(`%${keyword}%`, `%${keyword}%`);
    }

    sql += ' ORDER BY id DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const [rows] = await db.query(sql, params);
    return rows;
  }

  // 获取单词总数
  static async getCount(filters = {}) {
    const { level_id, keyword = '' } = filters;

    let sql = 'SELECT COUNT(*) as total FROM words WHERE 1=1';
    const params = [];

    if (level_id) {
      sql += ' AND level_id = ?';
      params.push(level_id);
    }

    if (keyword) {
      sql += ' AND (word LIKE ? OR chinese LIKE ?)';
      params.push(`%${keyword}%`, `%${keyword}%`);
    }

    const [rows] = await db.query(sql, params);
    return rows[0].total;
  }

  // 根据ID获取单词
  static async getById(id) {
    const [rows] = await db.query('SELECT * FROM words WHERE id = ?', [id]);
    return rows[0];
  }

  // 根据等级随机获取单词
  static async getRandomByLevel(level_id, count = 10) {
    const sql = `
      SELECT * FROM words
      WHERE level_id = ? AND status = 1
      ORDER BY RAND()
      LIMIT ?
    `;
    const [rows] = await db.query(sql, [level_id, count]);
    return rows;
  }

  // 创建单词
  static async create(wordData) {
    const { word, chinese, phonetic, level_id } = wordData;
    const sql = 'INSERT INTO words (word, chinese, phonetic, level_id) VALUES (?, ?, ?, ?)';
    const [result] = await db.query(sql, [word, chinese, phonetic || '', level_id]);
    return result.insertId;
  }

  // 更新单词
  static async update(id, wordData) {
    const { word, chinese, phonetic, level_id, status } = wordData;
    const sql = `
      UPDATE words
      SET word = ?, chinese = ?, phonetic = ?, level_id = ?, status = ?
      WHERE id = ?
    `;
    const [result] = await db.query(sql, [word, chinese, phonetic || '', level_id, status !== undefined ? status : 1, id]);
    return result.affectedRows;
  }

  // 删除单词
  static async delete(id) {
    const [result] = await db.query('DELETE FROM words WHERE id = ?', [id]);
    return result.affectedRows;
  }

  // 批量创建单词
  static async batchCreate(wordsArray) {
    if (!wordsArray || wordsArray.length === 0) {
      return 0;
    }

    const sql = 'INSERT INTO words (word, chinese, phonetic, level_id) VALUES ?';
    const values = wordsArray.map(w => [w.word, w.chinese, w.phonetic || '', w.level_id]);
    const [result] = await db.query(sql, [values]);
    return result.affectedRows;
  }

  // 批量删除单词
  static async batchDelete(ids) {
    if (!ids || ids.length === 0) {
      return 0;
    }

    const placeholders = ids.map(() => '?').join(',');
    const sql = `DELETE FROM words WHERE id IN (${placeholders})`;
    const [result] = await db.query(sql, ids);
    return result.affectedRows;
  }
}

module.exports = Word;
