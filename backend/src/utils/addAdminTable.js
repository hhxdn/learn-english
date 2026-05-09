const mysql = require('mysql2/promise');
require('dotenv').config();

async function addAdminTable() {
  let connection;

  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'learn_english'
    });

    console.log('已连接到数据库');

    // 创建管理员表
    const adminTableSql = `
      CREATE TABLE IF NOT EXISTS admins (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL COMMENT '用户名',
        password VARCHAR(255) NOT NULL COMMENT '密码（加密）',
        nickname VARCHAR(100) DEFAULT '管理员' COMMENT '昵称',
        role VARCHAR(20) DEFAULT 'admin' COMMENT '角色',
        status TINYINT DEFAULT 1 COMMENT '状态：1-启用，0-禁用',
        last_login_time TIMESTAMP NULL COMMENT '最后登录时间',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_username (username)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='管理员表';
    `;

    await connection.query(adminTableSql);
    console.log('✓ 管理员表创建成功');

    // 插入默认管理员账户（密码：admin123）
    // 使用简单的加密方式（实际项目应该使用bcrypt）
    const crypto = require('crypto');
    const password = 'admin123';
    const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');

    const insertAdminSql = `
      INSERT INTO admins (username, password, nickname, role)
      VALUES ('admin', ?, '超级管理员', 'super_admin')
      ON DUPLICATE KEY UPDATE username=username;
    `;

    await connection.query(insertAdminSql, [hashedPassword]);
    console.log('✓ 默认管理员账户创建成功');
    console.log('  用户名: admin');
    console.log('  密码: admin123');

    console.log('\n✓ 管理员系统创建完成！');

  } catch (error) {
    console.error('创建表失败:', error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

addAdminTable();
