const mysql = require('mysql2/promise');
require('dotenv').config();

async function addUserTables() {
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

    // 创建用户表
    const userTableSql = `
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        openid VARCHAR(100) UNIQUE NOT NULL COMMENT '微信OpenID',
        nickname VARCHAR(100) DEFAULT '学习者' COMMENT '昵称',
        avatar_url VARCHAR(500) DEFAULT '' COMMENT '头像URL',
        total_games INT DEFAULT 0 COMMENT '总游戏次数',
        total_correct INT DEFAULT 0 COMMENT '总答对数',
        total_wrong INT DEFAULT 0 COMMENT '总答错数',
        best_accuracy DECIMAL(5,2) DEFAULT 0 COMMENT '最佳正确率',
        total_time INT DEFAULT 0 COMMENT '总学习时长（秒）',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_openid (openid)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户表';
    `;

    await connection.query(userTableSql);
    console.log('✓ 用户表创建成功');

    // 创建游戏记录表
    const gameRecordSql = `
      CREATE TABLE IF NOT EXISTS game_records (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL COMMENT '用户ID',
        openid VARCHAR(100) NOT NULL COMMENT '微信OpenID',
        level_id VARCHAR(20) NOT NULL COMMENT '等级ID',
        correct_count INT DEFAULT 0 COMMENT '答对数',
        wrong_count INT DEFAULT 0 COMMENT '答错数',
        total_count INT DEFAULT 0 COMMENT '总题数',
        accuracy DECIMAL(5,2) DEFAULT 0 COMMENT '正确率',
        time_spent INT DEFAULT 0 COMMENT '用时（秒）',
        score INT DEFAULT 0 COMMENT '得分',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_user (user_id),
        INDEX idx_openid (openid),
        INDEX idx_level (level_id),
        INDEX idx_accuracy (accuracy),
        INDEX idx_score (score),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='游戏记录表';
    `;

    await connection.query(gameRecordSql);
    console.log('✓ 游戏记录表创建成功');

    // 插入默认用户（用于测试）
    const defaultUserSql = `
      INSERT INTO users (openid, nickname, avatar_url)
      VALUES ('default_user', '默认用户', '')
      ON DUPLICATE KEY UPDATE nickname=nickname;
    `;

    await connection.query(defaultUserSql);
    console.log('✓ 默认用户创建成功');

    console.log('\n✓ 用户系统表创建完成！');

  } catch (error) {
    console.error('创建表失败:', error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

addUserTables();
