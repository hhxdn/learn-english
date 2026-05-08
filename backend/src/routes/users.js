const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');

// 用户登录/注册
router.post('/login', UserController.login);

// 获取用户信息
router.get('/info', UserController.getUserInfo);

// 更新用户信息
router.put('/info', UserController.updateUserInfo);

// 获取排行榜
router.get('/leaderboard', UserController.getLeaderboard);

module.exports = router;
