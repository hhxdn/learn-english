const Level = require('../models/Level');

class LevelController {
  // 获取所有等级
  static async getLevels(req, res) {
    try {
      const levels = await Level.getAll();

      // 获取每个等级的单词数量
      for (const level of levels) {
        level.total_words = await Level.getWordCount(level.id);
      }

      res.json({
        code: 200,
        message: 'success',
        data: levels
      });
    } catch (error) {
      console.error('获取等级列表失败:', error);
      res.status(500).json({
        code: 500,
        message: '获取等级列表失败',
        error: error.message
      });
    }
  }

  // 获取单个等级
  static async getLevel(req, res) {
    try {
      const { id } = req.params;
      const level = await Level.getById(id);

      if (!level) {
        return res.status(404).json({
          code: 404,
          message: '等级不存在'
        });
      }

      level.total_words = await Level.getWordCount(id);

      res.json({
        code: 200,
        message: 'success',
        data: level
      });
    } catch (error) {
      console.error('获取等级失败:', error);
      res.status(500).json({
        code: 500,
        message: '获取等级失败',
        error: error.message
      });
    }
  }

  // 创建等级
  static async createLevel(req, res) {
    try {
      const { id, name, word_count, color, sort_order } = req.body;

      if (!id || !name) {
        return res.status(400).json({
          code: 400,
          message: '缺少必填字段'
        });
      }

      await Level.create({ id, name, word_count, color, sort_order });

      res.json({
        code: 200,
        message: '创建成功'
      });
    } catch (error) {
      console.error('创建等级失败:', error);
      res.status(500).json({
        code: 500,
        message: '创建等级失败',
        error: error.message
      });
    }
  }

  // 更新等级
  static async updateLevel(req, res) {
    try {
      const { id } = req.params;
      const { name, word_count, color, sort_order } = req.body;

      if (!name) {
        return res.status(400).json({
          code: 400,
          message: '缺少必填字段'
        });
      }

      const affectedRows = await Level.update(id, { name, word_count, color, sort_order });

      if (affectedRows === 0) {
        return res.status(404).json({
          code: 404,
          message: '等级不存在'
        });
      }

      res.json({
        code: 200,
        message: '更新成功'
      });
    } catch (error) {
      console.error('更新等级失败:', error);
      res.status(500).json({
        code: 500,
        message: '更新等级失败',
        error: error.message
      });
    }
  }

  // 删除等级
  static async deleteLevel(req, res) {
    try {
      const { id } = req.params;
      const affectedRows = await Level.delete(id);

      if (affectedRows === 0) {
        return res.status(404).json({
          code: 404,
          message: '等级不存在'
        });
      }

      res.json({
        code: 200,
        message: '删除成功'
      });
    } catch (error) {
      console.error('删除等级失败:', error);
      res.status(500).json({
        code: 500,
        message: '删除等级失败',
        error: error.message
      });
    }
  }
}

module.exports = LevelController;
