const mysql = require('mysql2/promise');
require('dotenv').config();

async function addDailyChallengeTable() {
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

    // 创建每日挑战表
    const challengeSql = `
      CREATE TABLE IF NOT EXISTS daily_challenges (
        id INT AUTO_INCREMENT PRIMARY KEY,
        challenge_date DATE UNIQUE NOT NULL COMMENT '挑战日期',
        level_id VARCHAR(20) NOT NULL COMMENT '等级ID',
        word_count INT DEFAULT 20 COMMENT '单词数量',
        time_limit INT DEFAULT 300 COMMENT '时间限制（秒）',
        reward_points INT DEFAULT 100 COMMENT '奖励积分',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_date (challenge_date)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='每日挑战表';
    `;

    await connection.query(challengeSql);
    console.log('✓ 每日挑战表创建成功');

    // 创建挑战记录表
    const recordSql = `
      CREATE TABLE IF NOT EXISTS challenge_records (
        id INT AUTO_INCREMENT PRIMARY KEY,
        challenge_id INT NOT NULL COMMENT '挑战ID',
        user_id INT NOT NULL COMMENT '用户ID',
        openid VARCHAR(100) NOT NULL COMMENT '微信OpenID',
        correct_count INT DEFAULT 0 COMMENT '答对数',
        wrong_count INT DEFAULT 0 COMMENT '答错数',
        time_spent INT DEFAULT 0 COMMENT '用时（秒）',
        completed TINYINT DEFAULT 0 COMMENT '是否完成',
        reward_earned INT DEFAULT 0 COMMENT '获得积分',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_challenge (challenge_id),
        INDEX idx_user (user_id),
        INDEX idx_openid (openid),
        UNIQUE KEY uk_challenge_user (challenge_id, openid),
        FOREIGN KEY (challenge_id) REFERENCES daily_challenges(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='挑战记录表';
    `;

    await connection.query(recordSql);
    console.log('✓ 挑战记录表创建成功');

    // 给用户表添加积分字段
    try {
      await connection.query(`
        ALTER TABLE users
        ADD COLUMN total_points INT DEFAULT 0 COMMENT '总积分'
      `);
      console.log('✓ 用户表添加total_points字段成功');
    } catch (error) {
      if (error.code === 'ER_DUP_FIELDNAME') {
        console.log('✓ total_points字段已存在');
      } else {
        console.log('添加total_points字段失败:', error.message);
      }
    }

    try {
      await connection.query(`
        ALTER TABLE users
        ADD COLUMN challenge_streak INT DEFAULT 0 COMMENT '连续挑战天数'
      `);
      console.log('✓ 用户表添加challenge_streak字段成功');
    } catch (error) {
      if (error.code === 'ER_DUP_FIELDNAME') {
        console.log('✓ challenge_streak字段已存在');
      } else {
        console.log('添加challenge_streak字段失败:', error.message);
      }
    }

    // 插入今天的挑战
    const today = new Date().toISOString().split('T')[0];
    const levels = ['primary', 'middle', 'high', 'cet4', 'cet6'];
    const randomLevel = levels[Math.floor(Math.random() * levels.length)];

    const insertChallengeSql = `
      INSERT INTO daily_challenges (challenge_date, level_id, word_count, time_limit, reward_points)
      VALUES (?, ?, 20, 300, 100)
      ON DUPLICATE KEY UPDATE level_id=level_id;
    `;

    await connection.query(insertChallengeSql, [today, randomLevel]);
    console.log(`✓ 今日挑战创建成功（等级：${randomLevel}）`);

    console.log('\n✓ 每日挑战系统创建完成！');

  } catch (error) {
    console.error('创建表失败:', error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

addDailyChallengeTable();
