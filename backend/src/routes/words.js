const express = require('express');
const router = express.Router();
const WordController = require('../controllers/wordController');

// 获取单词列表
router.get('/', WordController.getWords);

// 获取随机单词（小程序使用）
router.get('/random', WordController.getRandomWords);

// 获取单个单词
router.get('/:id', WordController.getWord);

// 创建单词
router.post('/', WordController.createWord);

// 更新单词
router.put('/:id', WordController.updateWord);

// 删除单词
router.delete('/:id', WordController.deleteWord);

// 批量导入
router.post('/batch/import', WordController.batchImport);

// 批量删除
router.post('/batch/delete', WordController.batchDelete);

module.exports = router;
