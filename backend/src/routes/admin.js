const express = require('express');
const router = express.Router();
const AdminController = require('../controllers/adminController');

// 管理员登录
router.post('/login', AdminController.login);

// 验证token
router.post('/verify', AdminController.verifyToken);

// 修改密码
router.post('/change-password', AdminController.changePassword);

module.exports = router;
