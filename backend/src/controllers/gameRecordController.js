const GameRecord = require('../models/GameRecord');
const User = require('../models/User');

class GameRecordController {
  // 提交游戏记录
  static async submitRecord(req, res) {
    try {
      const {
        openid,
        level_id,
        correct_count,
        wrong_count,
        time_spent
      } = req.body;

      if (!openid || !level_id || correct_count === undefined || wrong_count === undefined) {
        return res.status(400).json({
          code: 400,
          message: '缺少必填字段'
        });
      }

      // 获取用户
      const user = await User.getByOpenId(openid);

      if (!user) {
        return res.status(404).json({
          code: 404,
          message: '用户不存在'
        });
      }

      // 计算统计数据
      const total_count = correct_count + wrong_count;
      const accuracy = total_count > 0 ? (correct_count / total_count * 100).toFixed(2) : 0;
      const score = Math.round(correct_count * 10 + (accuracy >= 90 ? 50 : 0) - wrong_count * 2);

      // 创建游戏记录
      const recordId = await GameRecord.create({
        user_id: user.id,
        openid,
        level_id,
        correct_count,
        wrong_count,
        total_count,
        accuracy: parseFloat(accuracy),
        time_spent: time_spent || 0,
        score: Math.max(0, score)
      });

      // 更新用户统计
      await User.updateStats(openid, {
        correct_count,
        wrong_count,
        time_spent: time_spent || 0,
        accuracy: parseFloat(accuracy)
      });

      res.json({
        code: 200,
        message: '提交成功',
        data: {
          record_id: recordId,
          accuracy: parseFloat(accuracy),
          score: Math.max(0, score)
        }
      });
    } catch (error) {
      console.error('提交游戏记录失败:', error);
      res.status(500).json({
        code: 500,
        message: '提交失败',
        error: error.message
      });
    }
  }

  // 获取用户游戏记录
  static async getUserRecords(req, res) {
    try {
      const { openid, level_id, page, limit } = req.query;

      if (!openid) {
        return res.status(400).json({
          code: 400,
          message: '缺少openid'
        });
      }

      const filters = {
        level_id,
        page: parseInt(page) || 1,
        limit: parseInt(limit) || 20
      };

      const records = await GameRecord.getByUser(openid, filters);
      const total = await GameRecord.getCount(openid, level_id);

      res.json({
        code: 200,
        message: 'success',
        data: {
          list: records,
          total,
          page: filters.page,
          limit: filters.limit
        }
      });
    } catch (error) {
      console.error('获取游戏记录失败:', error);
      res.status(500).json({
        code: 500,
        message: '获取记录失败',
        error: error.message
      });
    }
  }

  // 获取等级排行榜
  static async getLevelLeaderboard(req, res) {
    try {
      const { level_id, limit = 50 } = req.query;

      if (!level_id) {
        return res.status(400).json({
          code: 400,
          message: '缺少level_id'
        });
      }

      const leaderboard = await GameRecord.getLevelLeaderboard(level_id, parseInt(limit));

      // 添加排名
      const rankedLeaderboard = leaderboard.map((record, index) => ({
        ...record,
        rank: index + 1
      }));

      res.json({
        code: 200,
        message: 'success',
        data: rankedLeaderboard
      });
    } catch (error) {
      console.error('获取等级排行榜失败:', error);
      res.status(500).json({
        code: 500,
        message: '获取排行榜失败',
        error: error.message
      });
    }
  }

  // 获取用户最佳成绩
  static async getBestRecord(req, res) {
    try {
      const { openid, level_id } = req.query;

      if (!openid || !level_id) {
        return res.status(400).json({
          code: 400,
          message: '缺少必填参数'
        });
      }

      const record = await GameRecord.getBestRecord(openid, level_id);

      res.json({
        code: 200,
        message: 'success',
        data: record || null
      });
    } catch (error) {
      console.error('获取最佳成绩失败:', error);
      res.status(500).json({
        code: 500,
        message: '获取失败',
        error: error.message
      });
    }
  }
}

module.exports = GameRecordController;
