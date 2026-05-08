const db = require('../config/database');

class Level {
  // 获取所有等级
  static async getAll() {
    const [rows] = await db.query('SELECT * FROM levels ORDER BY sort_order ASC');
    return rows;
  }

  // 根据ID获取等级
  static async getById(id) {
    const [rows] = await db.query('SELECT * FROM levels WHERE id = ?', [id]);
    return rows[0];
  }

  // 创建等级
  static async create(levelData) {
    const { id, name, word_count, color, sort_order } = levelData;
    const sql = 'INSERT INTO levels (id, name, word_count, color, sort_order) VALUES (?, ?, ?, ?, ?)';
    const [result] = await db.query(sql, [id, name, word_count || 10, color || '#4A90E2', sort_order || 0]);
    return result.insertId;
  }

  // 更新等级
  static async update(id, levelData) {
    const { name, word_count, color, sort_order } = levelData;
    const sql = 'UPDATE levels SET name = ?, word_count = ?, color = ?, sort_order = ? WHERE id = ?';
    const [result] = await db.query(sql, [name, word_count, color, sort_order, id]);
    return result.affectedRows;
  }

  // 删除等级
  static async delete(id) {
    const [result] = await db.query('DELETE FROM levels WHERE id = ?', [id]);
    return result.affectedRows;
  }

  // 获取等级的单词数量
  static async getWordCount(id) {
    const [rows] = await db.query('SELECT COUNT(*) as count FROM words WHERE level_id = ?', [id]);
    return rows[0].count;
  }
}

module.exports = Level;
