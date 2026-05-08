const DailyChallenge = require('../models/DailyChallenge');
const User = require('../models/User');

class DailyChallengeController {
  // 获取今日挑战
  static async getTodayChallenge(req, res) {
    try {
      const { openid } = req.query;

      const challenge = await DailyChallenge.getToday();

      if (!challenge) {
        return res.status(404).json({
          code: 404,
          message: '今日挑战未生成'
        });
      }

      // 获取用户今日挑战状态
      let userStatus = null;
      if (openid) {
        userStatus = await DailyChallenge.getUserTodayStatus(openid);
      }

      res.json({
        code: 200,
        message: 'success',
        data: {
          challenge,
          user_status: userStatus
        }
      });
    } catch (error) {
      console.error('获取今日挑战失败:', error);
      res.status(500).json({
        code: 500,
        message: '获取挑战失败',
        error: error.message
      });
    }
  }

  // 提交挑战记录
  static async submitChallenge(req, res) {
    try {
      const {
        challenge_id,
        openid,
        correct_count,
        wrong_count,
        time_spent,
        completed
      } = req.body;

      if (!challenge_id || !openid || correct_count === undefined) {
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

      // 提交记录
      await DailyChallenge.submitRecord({
        challenge_id,
        user_id: user.id,
        openid,
        correct_count,
        wrong_count: wrong_count || 0,
        time_spent: time_spent || 0,
        completed: completed || false
      });

      res.json({
        code: 200,
        message: '提交成功'
      });
    } catch (error) {
      console.error('提交挑战记录失败:', error);
      res.status(500).json({
        code: 500,
        message: '提交失败',
        error: error.message
      });
    }
  }

  // 获取挑战排行榜
  static async getChallengeLeaderboard(req, res) {
    try {
      const { limit = 50 } = req.query;

      const leaderboard = await DailyChallenge.getLeaderboard(parseInt(limit));

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
      console.error('获取挑战排行榜失败:', error);
      res.status(500).json({
        code: 500,
        message: '获取排行榜失败',
        error: error.message
      });
    }
  }

  // 获取用户挑战历史
  static async getUserHistory(req, res) {
    try {
      const { openid, limit = 30 } = req.query;

      if (!openid) {
        return res.status(400).json({
          code: 400,
          message: '缺少openid'
        });
      }

      const history = await DailyChallenge.getUserHistory(openid, parseInt(limit));

      res.json({
        code: 200,
        message: 'success',
        data: history
      });
    } catch (error) {
      console.error('获取挑战历史失败:', error);
      res.status(500).json({
        code: 500,
        message: '获取历史失败',
        error: error.message
      });
    }
  }

  // 创建每日挑战（管理员接口）
  static async createChallenge(req, res) {
    try {
      const { challenge_date, level_id, word_count, time_limit, reward_points } = req.body;

      if (!challenge_date || !level_id) {
        return res.status(400).json({
          code: 400,
          message: '缺少必填字段'
        });
      }

      await DailyChallenge.create({
        challenge_date,
        level_id,
        word_count,
        time_limit,
        reward_points
      });

      res.json({
        code: 200,
        message: '创建成功'
      });
    } catch (error) {
      console.error('创建挑战失败:', error);
      res.status(500).json({
        code: 500,
        message: '创建失败',
        error: error.message
      });
    }
  }
}

module.exports = DailyChallengeController;
