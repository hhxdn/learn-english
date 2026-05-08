const express = require('express');
const router = express.Router();
const GameRecordController = require('../controllers/gameRecordController');

// 提交游戏记录
router.post('/', GameRecordController.submitRecord);

// 获取用户游戏记录
router.get('/', GameRecordController.getUserRecords);

// 获取用户最佳成绩
router.get('/best', GameRecordController.getBestRecord);

// 获取等级排行榜
router.get('/leaderboard', GameRecordController.getLevelLeaderboard);

module.exports = router;
