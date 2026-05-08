const db = require('../config/database');

class DailyChallenge {
  // 获取今日挑战
  static async getToday() {
    const today = new Date().toISOString().split('T')[0];
    const [rows] = await db.query(
      'SELECT * FROM daily_challenges WHERE challenge_date = ?',
      [today]
    );
    return rows[0];
  }

  // 创建每日挑战
  static async create(challengeData) {
    const { challenge_date, level_id, word_count, time_limit, reward_points } = challengeData;

    const sql = `
      INSERT INTO daily_challenges (challenge_date, level_id, word_count, time_limit, reward_points)
      VALUES (?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        level_id = VALUES(level_id),
        word_count = VALUES(word_count),
        time_limit = VALUES(time_limit),
        reward_points = VALUES(reward_points)
    `;

    const [result] = await db.query(sql, [
      challenge_date,
      level_id,
      word_count || 20,
      time_limit || 300,
      reward_points || 100
    ]);

    return result.insertId || result.affectedRows;
  }

  // 获取用户今日挑战状态
  static async getUserTodayStatus(openid) {
    const today = new Date().toISOString().split('T')[0];

    const sql = `
      SELECT cr.*
      FROM challenge_records cr
      INNER JOIN daily_challenges dc ON cr.challenge_id = dc.id
      WHERE cr.openid = ? AND dc.challenge_date = ?
    `;

    const [rows] = await db.query(sql, [openid, today]);
    return rows[0];
  }

  // 提交挑战记录
  static async submitRecord(recordData) {
    const {
      challenge_id,
      user_id,
      openid,
      correct_count,
      wrong_count,
      time_spent,
      completed
    } = recordData;

    // 获取挑战信息
    const [challenges] = await db.query(
      'SELECT * FROM daily_challenges WHERE id = ?',
      [challenge_id]
    );

    if (challenges.length === 0) {
      throw new Error('挑战不存在');
    }

    const challenge = challenges[0];
    const reward_earned = completed ? challenge.reward_points : 0;

    const sql = `
      INSERT INTO challenge_records
      (challenge_id, user_id, openid, correct_count, wrong_count, time_spent, completed, reward_earned)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        correct_count = VALUES(correct_count),
        wrong_count = VALUES(wrong_count),
        time_spent = VALUES(time_spent),
        completed = VALUES(completed),
        reward_earned = VALUES(reward_earned)
    `;

    const [result] = await db.query(sql, [
      challenge_id,
      user_id,
      openid,
      correct_count,
      wrong_count,
      time_spent,
      completed ? 1 : 0,
      reward_earned
    ]);

    // 如果完成挑战，更新用户积分和连续天数
    if (completed) {
      await this.updateUserPoints(openid, reward_earned);
    }

    return result.insertId || result.affectedRows;
  }

  // 更新用户积分和连续天数
  static async updateUserPoints(openid, points) {
    // 检查昨天是否完成挑战
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    const [yesterdayRecords] = await db.query(`
      SELECT cr.completed
      FROM challenge_records cr
      INNER JOIN daily_challenges dc ON cr.challenge_id = dc.id
      WHERE cr.openid = ? AND dc.challenge_date = ? AND cr.completed = 1
    `, [openid, yesterdayStr]);

    const hasYesterdayChallenge = yesterdayRecords.length > 0;

    // 更新积分和连续天数
    const sql = `
      UPDATE users
      SET
        total_points = total_points + ?,
        challenge_streak = CASE
          WHEN ? THEN challenge_streak + 1
          ELSE 1
        END
      WHERE openid = ?
    `;

    await db.query(sql, [points, hasYesterdayChallenge, openid]);
  }

  // 获取挑战排行榜
  static async getLeaderboard(limit = 50) {
    const today = new Date().toISOString().split('T')[0];

    const sql = `
      SELECT
        u.openid,
        u.nickname,
        u.avatar_url,
        cr.correct_count,
        cr.wrong_count,
        cr.time_spent,
        cr.completed,
        cr.reward_earned
      FROM challenge_records cr
      INNER JOIN daily_challenges dc ON cr.challenge_id = dc.id
      INNER JOIN users u ON cr.openid = u.openid
      WHERE dc.challenge_date = ? AND cr.completed = 1
      ORDER BY cr.correct_count DESC, cr.time_spent ASC
      LIMIT ?
    `;

    const [rows] = await db.query(sql, [today, limit]);
    return rows;
  }

  // 获取用户挑战历史
  static async getUserHistory(openid, limit = 30) {
    const sql = `
      SELECT
        dc.challenge_date,
        dc.level_id,
        cr.correct_count,
        cr.wrong_count,
        cr.time_spent,
        cr.completed,
        cr.reward_earned
      FROM challenge_records cr
      INNER JOIN daily_challenges dc ON cr.challenge_id = dc.id
      WHERE cr.openid = ?
      ORDER BY dc.challenge_date DESC
      LIMIT ?
    `;

    const [rows] = await db.query(sql, [openid, limit]);
    return rows;
  }
}

module.exports = DailyChallenge;
