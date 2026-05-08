const mysql = require('mysql2/promise');
require('dotenv').config();

async function addWrongWordsTable() {
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

    const sql = `
      CREATE TABLE IF NOT EXISTS wrong_words (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id VARCHAR(100) DEFAULT 'default_user' COMMENT '用户ID',
        word_id INT NOT NULL COMMENT '单词ID',
        word VARCHAR(100) NOT NULL COMMENT '单词',
        chinese VARCHAR(200) NOT NULL COMMENT '中文释义',
        phonetic VARCHAR(100) DEFAULT '' COMMENT '音标',
        level_id VARCHAR(20) NOT NULL COMMENT '等级ID',
        wrong_count INT DEFAULT 1 COMMENT '答错次数',
        last_wrong_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '最后答错时间',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_user (user_id),
        INDEX idx_word (word_id),
        UNIQUE KEY uk_user_word (user_id, word_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='错题记录表';
    `;

    await connection.query(sql);

    console.log('✓ 错题记录表创建成功！');

  } catch (error) {
    console.error('创建表失败:', error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

addWrongWordsTable();
