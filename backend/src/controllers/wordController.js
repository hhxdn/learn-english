const Word = require('../models/Word');

class WordController {
  // 获取单词列表
  static async getWords(req, res) {
    try {
      const { level_id, page, limit, keyword } = req.query;
      const filters = { level_id, page: parseInt(page) || 1, limit: parseInt(limit) || 50, keyword };

      const words = await Word.getAll(filters);
      const total = await Word.getCount(filters);

      res.json({
        code: 200,
        message: 'success',
        data: {
          list: words,
          total,
          page: filters.page,
          limit: filters.limit
        }
      });
    } catch (error) {
      console.error('获取单词列表失败:', error);
      res.status(500).json({
        code: 500,
        message: '获取单词列表失败',
        error: error.message
      });
    }
  }

  // 获取单个单词
  static async getWord(req, res) {
    try {
      const { id } = req.params;
      const word = await Word.getById(id);

      if (!word) {
        return res.status(404).json({
          code: 404,
          message: '单词不存在'
        });
      }

      res.json({
        code: 200,
        message: 'success',
        data: word
      });
    } catch (error) {
      console.error('获取单词失败:', error);
      res.status(500).json({
        code: 500,
        message: '获取单词失败',
        error: error.message
      });
    }
  }

  // 根据等级随机获取单词（小程序使用）
  static async getRandomWords(req, res) {
    try {
      const { level_id, count } = req.query;

      if (!level_id) {
        return res.status(400).json({
          code: 400,
          message: '缺少level_id参数'
        });
      }

      const words = await Word.getRandomByLevel(level_id, parseInt(count) || 10);

      res.json({
        code: 200,
        message: 'success',
        data: words
      });
    } catch (error) {
      console.error('获取随机单词失败:', error);
      res.status(500).json({
        code: 500,
        message: '获取随机单词失败',
        error: error.message
      });
    }
  }

  // 创建单词
  static async createWord(req, res) {
    try {
      const { word, chinese, phonetic, level_id } = req.body;

      if (!word || !chinese || !level_id) {
        return res.status(400).json({
          code: 400,
          message: '缺少必填字段'
        });
      }

      const id = await Word.create({ word, chinese, phonetic, level_id });

      res.json({
        code: 200,
        message: '创建成功',
        data: { id }
      });
    } catch (error) {
      console.error('创建单词失败:', error);
      res.status(500).json({
        code: 500,
        message: '创建单词失败',
        error: error.message
      });
    }
  }

  // 更新单词
  static async updateWord(req, res) {
    try {
      const { id } = req.params;
      const { word, chinese, phonetic, level_id, status } = req.body;

      if (!word || !chinese || !level_id) {
        return res.status(400).json({
          code: 400,
          message: '缺少必填字段'
        });
      }

      const affectedRows = await Word.update(id, { word, chinese, phonetic, level_id, status });

      if (affectedRows === 0) {
        return res.status(404).json({
          code: 404,
          message: '单词不存在'
        });
      }

      res.json({
        code: 200,
        message: '更新成功'
      });
    } catch (error) {
      console.error('更新单词失败:', error);
      res.status(500).json({
        code: 500,
        message: '更新单词失败',
        error: error.message
      });
    }
  }

  // 删除单词
  static async deleteWord(req, res) {
    try {
      const { id } = req.params;
      const affectedRows = await Word.delete(id);

      if (affectedRows === 0) {
        return res.status(404).json({
          code: 404,
          message: '单词不存在'
        });
      }

      res.json({
        code: 200,
        message: '删除成功'
      });
    } catch (error) {
      console.error('删除单词失败:', error);
      res.status(500).json({
        code: 500,
        message: '删除单词失败',
        error: error.message
      });
    }
  }

  // 批量导入单词
  static async batchImport(req, res) {
    try {
      const { words } = req.body;

      if (!words || !Array.isArray(words) || words.length === 0) {
        return res.status(400).json({
          code: 400,
          message: '请提供有效的单词数组'
        });
      }

      // 验证数据
      for (const w of words) {
        if (!w.word || !w.chinese || !w.level_id) {
          return res.status(400).json({
            code: 400,
            message: '每个单词必须包含word、chinese和level_id字段'
          });
        }
      }

      const count = await Word.batchCreate(words);

      res.json({
        code: 200,
        message: `成功导入${count}个单词`,
        data: { count }
      });
    } catch (error) {
      console.error('批量导入失败:', error);
      res.status(500).json({
        code: 500,
        message: '批量导入失败',
        error: error.message
      });
    }
  }

  // 批量删除单词
  static async batchDelete(req, res) {
    try {
      const { ids } = req.body;

      if (!ids || !Array.isArray(ids) || ids.length === 0) {
        return res.status(400).json({
          code: 400,
          message: '请提供有效的ID数组'
        });
      }

      const count = await Word.batchDelete(ids);

      res.json({
        code: 200,
        message: `成功删除${count}个单词`,
        data: { count }
      });
    } catch (error) {
      console.error('批量删除失败:', error);
      res.status(500).json({
        code: 500,
        message: '批量删除失败',
        error: error.message
      });
    }
  }
}

module.exports = WordController;
