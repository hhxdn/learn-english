const express = require('express');
const router = express.Router();
const LevelController = require('../controllers/levelController');

// 获取等级列表
router.get('/', LevelController.getLevels);

// 获取单个等级
router.get('/:id', LevelController.getLevel);

// 创建等级
router.post('/', LevelController.createLevel);

// 更新等级
router.put('/:id', LevelController.updateLevel);

// 删除等级
router.delete('/:id', LevelController.deleteLevel);

module.exports = router;
