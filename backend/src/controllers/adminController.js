const Admin = require('../models/Admin');

class AdminController {
  // 管理员登录
  static async login(req, res) {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return res.status(400).json({
          code: 400,
          message: '用户名和密码不能为空'
        });
      }

      // 查询管理员
      const admin = await Admin.getByUsername(username);

      if (!admin) {
        return res.status(401).json({
          code: 401,
          message: '用户名或密码错误'
        });
      }

      // 检查状态
      if (admin.status !== 1) {
        return res.status(403).json({
          code: 403,
          message: '账户已被禁用'
        });
      }

      // 验证密码
      const isValid = Admin.verifyPassword(password, admin.password);

      if (!isValid) {
        return res.status(401).json({
          code: 401,
          message: '用户名或密码错误'
        });
      }

      // 更新最后登录时间
      await Admin.updateLastLogin(admin.id);

      // 生成简单的token（实际项目应该使用JWT）
      const token = Buffer.from(`${admin.id}:${admin.username}:${Date.now()}`).toString('base64');

      // 返回登录信息（不返回密码）
      res.json({
        code: 200,
        message: '登录成功',
        data: {
          id: admin.id,
          username: admin.username,
          nickname: admin.nickname,
          role: admin.role,
          token
        }
      });
    } catch (error) {
      console.error('登录失败:', error);
      res.status(500).json({
        code: 500,
        message: '登录失败',
        error: error.message
      });
    }
  }

  // 验证token
  static async verifyToken(req, res) {
    try {
      const { token } = req.body;

      if (!token) {
        return res.status(401).json({
          code: 401,
          message: 'Token不能为空'
        });
      }

      // 简单验证（实际项目应该使用JWT验证）
      try {
        const decoded = Buffer.from(token, 'base64').toString();
        const [id, username, timestamp] = decoded.split(':');

        // 检查token是否过期（24小时）
        const now = Date.now();
        if (now - parseInt(timestamp) > 24 * 60 * 60 * 1000) {
          return res.status(401).json({
            code: 401,
            message: 'Token已过期'
          });
        }

        // 查询管理员
        const admin = await Admin.getByUsername(username);

        if (!admin || admin.id !== parseInt(id)) {
          return res.status(401).json({
            code: 401,
            message: 'Token无效'
          });
        }

        res.json({
          code: 200,
          message: 'Token有效',
          data: {
            id: admin.id,
            username: admin.username,
            nickname: admin.nickname,
            role: admin.role
          }
        });
      } catch (error) {
        return res.status(401).json({
          code: 401,
          message: 'Token格式错误'
        });
      }
    } catch (error) {
      console.error('验证Token失败:', error);
      res.status(500).json({
        code: 500,
        message: '验证失败',
        error: error.message
      });
    }
  }

  // 修改密码
  static async changePassword(req, res) {
    try {
      const { username, old_password, new_password } = req.body;

      if (!username || !old_password || !new_password) {
        return res.status(400).json({
          code: 400,
          message: '参数不完整'
        });
      }

      // 查询管理员
      const admin = await Admin.getByUsername(username);

      if (!admin) {
        return res.status(404).json({
          code: 404,
          message: '用户不存在'
        });
      }

      // 验证旧密码
      const isValid = Admin.verifyPassword(old_password, admin.password);

      if (!isValid) {
        return res.status(401).json({
          code: 401,
          message: '原密码错误'
        });
      }

      // 修改密码
      await Admin.changePassword(admin.id, new_password);

      res.json({
        code: 200,
        message: '密码修改成功'
      });
    } catch (error) {
      console.error('修改密码失败:', error);
      res.status(500).json({
        code: 500,
        message: '修改密码失败',
        error: error.message
      });
    }
  }
}

module.exports = AdminController;
