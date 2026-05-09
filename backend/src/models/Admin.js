const db = require('../config/database');
const crypto = require('crypto');

class Admin {
  // 根据用户名获取管理员
  static async getByUsername(username) {
    const [rows] = await db.query('SELECT * FROM admins WHERE username = ?', [username]);
    return rows[0];
  }

  // 验证密码
  static verifyPassword(password, hashedPassword) {
    const hash = crypto.createHash('sha256').update(password).digest('hex');
    return hash === hashedPassword;
  }

  // 更新最后登录时间
  static async updateLastLogin(id) {
    await db.query('UPDATE admins SET last_login_time = NOW() WHERE id = ?', [id]);
  }

  // 创建管理员
  static async create(adminData) {
    const { username, password, nickname, role } = adminData;
    const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');

    const sql = 'INSERT INTO admins (username, password, nickname, role) VALUES (?, ?, ?, ?)';
    const [result] = await db.query(sql, [username, hashedPassword, nickname || '管理员', role || 'admin']);
    return result.insertId;
  }

  // 修改密码
  static async changePassword(id, newPassword) {
    const hashedPassword = crypto.createHash('sha256').update(newPassword).digest('hex');
    const [result] = await db.query('UPDATE admins SET password = ? WHERE id = ?', [hashedPassword, id]);
    return result.affectedRows;
  }
}

module.exports = Admin;
