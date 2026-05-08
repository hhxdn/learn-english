const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function initDatabase() {
  let connection;

  try {
    // 先连接到MySQL服务器（不指定数据库）
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      multipleStatements: true
    });

    console.log('已连接到MySQL服务器');

    // 读取SQL文件
    const sqlFile = path.join(__dirname, '../../database.sql');
    const sql = fs.readFileSync(sqlFile, 'utf8');

    // 执行SQL
    await connection.query(sql);

    console.log('✓ 数据库初始化成功！');
    console.log('✓ 数据库名称: learn_english');
    console.log('✓ 已创建表: levels, words');
    console.log('✓ 已插入示例数据');

  } catch (error) {
    console.error('数据库初始化失败:', error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// 运行初始化
initDatabase();
