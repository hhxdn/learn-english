const WrongWord = require('../models/WrongWord');

class WrongWordController {
  // 添加错题
  static async addWrongWord(req, res) {
    try {
      const { user_id, word_id, word, chinese, phonetic, level_id } = req.body;

      if (!word_id || !word || !chinese || !level_id) {
        return res.status(400).json({
          code: 400,
          message: '缺少必填字段'
        });
      }

      await WrongWord.add({ user_id, word_id, word, chinese, phonetic, level_id });

      res.json({
        code: 200,
        message: '添加成功'
      });
    } catch (error) {
      console.error('添加错题失败:', error);
      res.status(500).json({
        code: 500,
        message: '添加错题失败',
        error: error.message
      });
    }
  }

  // 获取错题列表
  static async getWrongWords(req, res) {
    try {
      const { user_id = 'default_user', level_id, page, limit } = req.query;
      const filters = { level_id, page: parseInt(page) || 1, limit: parseInt(limit) || 50 };

      const words = await WrongWord.getByUser(user_id, filters);
      const total = await WrongWord.getCount(user_id, level_id);

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
      console.error('获取错题列表失败:', error);
      res.status(500).json({
        code: 500,
        message: '获取错题列表失败',
        error: error.message
      });
    }
  }

  // 获取错题统计
  static async getStats(req, res) {
    try {
      const { user_id = 'default_user' } = req.query;
      const stats = await WrongWord.getStats(user_id);

      res.json({
        code: 200,
        message: 'success',
        data: stats
      });
    } catch (error) {
      console.error('获取错题统计失败:', error);
      res.status(500).json({
        code: 500,
        message: '获取错题统计失败',
        error: error.message
      });
    }
  }

  // 删除错题
  static async deleteWrongWord(req, res) {
    try {
      const { id } = req.params;
      const { user_id = 'default_user' } = req.query;

      const affectedRows = await WrongWord.delete(id, user_id);

      if (affectedRows === 0) {
        return res.status(404).json({
          code: 404,
          message: '错题不存在'
        });
      }

      res.json({
        code: 200,
        message: '删除成功'
      });
    } catch (error) {
      console.error('删除错题失败:', error);
      res.status(500).json({
        code: 500,
        message: '删除错题失败',
        error: error.message
      });
    }
  }

  // 清空错题本
  static async clearWrongWords(req, res) {
    try {
      const { user_id = 'default_user', level_id } = req.body;

      const count = await WrongWord.clearAll(user_id, level_id);

      res.json({
        code: 200,
        message: `成功清空${count}条错题记录`,
        data: { count }
      });
    } catch (error) {
      console.error('清空错题本失败:', error);
      res.status(500).json({
        code: 500,
        message: '清空错题本失败',
        error: error.message
      });
    }
  }
}

module.exports = WrongWordController;
