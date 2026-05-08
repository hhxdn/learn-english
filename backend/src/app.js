const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();

const wordRoutes = require('./routes/words');
const levelRoutes = require('./routes/levels');
const wrongWordRoutes = require('./routes/wrongWords');
const userRoutes = require('./routes/users');
const gameRecordRoutes = require('./routes/gameRecords');
const dailyChallengeRoutes = require('./routes/dailyChallenges');

const app = express();
const PORT = process.env.PORT || 3000;

// 中间件
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 静态文件服务（管理后台）
app.use('/admin', express.static(path.join(__dirname, '../public/admin')));

// API路由
app.use('/api/words', wordRoutes);
app.use('/api/levels', levelRoutes);
app.use('/api/wrong-words', wrongWordRoutes);
app.use('/api/users', userRoutes);
app.use('/api/game-records', gameRecordRoutes);
app.use('/api/daily-challenges', dailyChallengeRoutes);

// 根路径重定向到管理后台
app.get('/', (req, res) => {
  res.redirect('/admin');
});

// 健康检查
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// 错误处理
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    code: 500,
    message: '服务器内部错误',
    error: err.message
  });
});

// 404处理
app.use((req, res) => {
  res.status(404).json({
    code: 404,
    message: '接口不存在'
  });
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════╗
║   英语单词追捕 - 后端服务已启动           ║
╠═══════════════════════════════════════════╣
║   服务地址: http://localhost:${PORT}       ║
║   管理后台: http://localhost:${PORT}/admin ║
║   API文档:  http://localhost:${PORT}/api   ║
╚═══════════════════════════════════════════╝
  `);
});

module.exports = app;
