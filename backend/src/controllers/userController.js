const User = require('../models/User');
const GameRecord = require('../models/GameRecord');

class UserController {
  // 用户登录/注册
  static async login(req, res) {
    try {
      const { openid, nickname, avatar_url } = req.body;

      if (!openid) {
        return res.status(400).json({
          code: 400,
          message: '缺少openid'
        });
      }

      const user = await User.getOrCreate(openid, { nickname, avatar_url });

      res.json({
        code: 200,
        message: 'success',
        data: user
      });
    } catch (error) {
      console.error('用户登录失败:', error);
      res.status(500).json({
        code: 500,
        message: '登录失败',
        error: error.message
      });
    }
  }

  // 获取用户信息
  static async getUserInfo(req, res) {
    try {
      const { openid } = req.query;

      if (!openid) {
        return res.status(400).json({
          code: 400,
          message: '缺少openid'
        });
      }

      const user = await User.getByOpenId(openid);

      if (!user) {
        return res.status(404).json({
          code: 404,
          message: '用户不存在'
        });
      }

      // 获取用户排名
      const ranking = await User.getRanking(openid);

      // 获取今日统计
      const todayStats = await GameRecord.getTodayStats(openid);

      res.json({
        code: 200,
        message: 'success',
        data: {
          ...user,
          ranking,
          today_stats: todayStats
        }
      });
    } catch (error) {
      console.error('获取用户信息失败:', error);
      res.status(500).json({
        code: 500,
        message: '获取用户信息失败',
        error: error.message
      });
    }
  }

  // 更新用户信息
  static async updateUserInfo(req, res) {
    try {
      const { openid, nickname, avatar_url } = req.body;

      if (!openid) {
        return res.status(400).json({
          code: 400,
          message: '缺少openid'
        });
      }

      const user = await User.getByOpenId(openid);

      if (!user) {
        return res.status(404).json({
          code: 404,
          message: '用户不存在'
        });
      }

      await User.update(user.id, { nickname, avatar_url });

      res.json({
        code: 200,
        message: '更新成功'
      });
    } catch (error) {
      console.error('更新用户信息失败:', error);
      res.status(500).json({
        code: 500,
        message: '更新失败',
        error: error.message
      });
    }
  }

  // 获取排行榜
  static async getLeaderboard(req, res) {
    try {
      const { limit = 100, order_by = 'best_accuracy' } = req.query;

      const leaderboard = await User.getLeaderboard(parseInt(limit), order_by);

      // 添加排名
      const rankedLeaderboard = leaderboard.map((user, index) => ({
        ...user,
        rank: index + 1
      }));

      res.json({
        code: 200,
        message: 'success',
        data: rankedLeaderboard
      });
    } catch (error) {
      console.error('获取排行榜失败:', error);
      res.status(500).json({
        code: 500,
        message: '获取排行榜失败',
        error: error.message
      });
    }
  }
}

module.exports = UserController;
