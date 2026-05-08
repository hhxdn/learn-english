const express = require('express');
const router = express.Router();
const DailyChallengeController = require('../controllers/dailyChallengeController');

// 获取今日挑战
router.get('/today', DailyChallengeController.getTodayChallenge);

// 提交挑战记录
router.post('/submit', DailyChallengeController.submitChallenge);

// 获取挑战排行榜
router.get('/leaderboard', DailyChallengeController.getChallengeLeaderboard);

// 获取用户挑战历史
router.get('/history', DailyChallengeController.getUserHistory);

// 创建挑战（管理员）
router.post('/create', DailyChallengeController.createChallenge);

module.exports = router;
