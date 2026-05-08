const express = require('express');
const router = express.Router();
const WrongWordController = require('../controllers/wrongWordController');

// 获取错题列表
router.get('/', WrongWordController.getWrongWords);

// 获取错题统计
router.get('/stats', WrongWordController.getStats);

// 添加错题
router.post('/', WrongWordController.addWrongWord);

// 删除错题
router.delete('/:id', WrongWordController.deleteWrongWord);

// 清空错题本
router.post('/clear', WrongWordController.clearWrongWords);

module.exports = router;
