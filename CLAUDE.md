# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

这是一个英语单词学习微信小程序，采用"警察抓小偷"的游戏形式。项目包含小程序前端、Node.js后端API和Web管理后台三部分。

### 核心功能
- 多等级支持：小学、初中、高中、四级、六级
- 游戏化学习：警察追捕小偷的进度条展示
- 实时反馈：答对前进，答错显示正确答案
- 成绩统计：正确率、用时、星级评价
- 管理后台：单词和等级的增删改查
- 批量导入：JSON格式批量导入单词
- MySQL数据库：持久化存储所有数据

## Project Structure

```
Learn-English/
├── pages/              # 小程序页面
│   ├── index/          # 等级选择页
│   ├── game/           # 游戏主页面
│   └── result/         # 结果页面
├── utils/
│   ├── api.js          # API接口封装
│   └── game.js         # 游戏工具函数
├── data/
│   └── words.js        # 本地单词数据（备用）
├── backend/            # 后端服务
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js      # 数据库连接配置
│   │   ├── controllers/
│   │   │   ├── wordController.js    # 单词控制器
│   │   │   └── levelController.js   # 等级控制器
│   │   ├── models/
│   │   │   ├── Word.js          # 单词模型
│   │   │   └── Level.js         # 等级模型
│   │   ├── routes/
│   │   │   ├── words.js         # 单词路由
│   │   │   └── levels.js        # 等级路由
│   │   ├── utils/
│   │   │   └── initDatabase.js  # 数据库初始化脚本
│   │   └── app.js               # Express应用入口
│   ├── public/admin/            # 管理后台前端
│   │   ├── index.html
│   │   ├── style.css
│   │   └── app.js
│   ├── database.sql             # 数据库SQL脚本
│   ├── .env                     # 环境配置
│   └── package.json
├── app.js              # 小程序入口
├── app.json            # 全局配置
└── app.wxss            # 全局样式
```

## Development Commands

### 后端服务

```bash
# 进入后端目录
cd backend

# 安装依赖
npm install

# 初始化数据库（首次运行）
npm run init-db

# 开发模式（自动重启）
npm run dev

# 生产模式
npm start
```

### 小程序

使用微信开发者工具打开项目根目录，点击"编译"运行。

注意：开发时需要在"详情" → "本地设置"中勾选"不校验合法域名"。

## Architecture

### 数据流

1. **小程序启动** → 调用 `/api/levels` 获取等级列表
2. **选择等级** → 调用 `/api/words/random` 获取随机单词
3. **游戏进行** → 本地判断答案，更新进度
4. **游戏结束** → 显示统计结果

### 核心模块

#### 1. 小程序端

**utils/api.js** - API接口封装
- `getLevels()`: 获取等级列表
- `getRandomWords(level_id, count)`: 获取随机单词

**utils/game.js** - 游戏工具函数
- `calculateDistance(current, total)`: 计算警察位置百分比
- `checkAnswer(userInput, correctWord)`: 检查答案正确性
- `formatTime(seconds)`: 格式化时间显示

**pages/game/game.js** - 游戏核心逻辑
- 从API获取单词数据
- 进度追踪：通过 `policePosition` 控制警察图标位置
- 答题判断：正确前进，错误显示答案但不前进
- 计时器：记录游戏用时

#### 2. 后端API

**数据模型**
- `Word.js`: 单词CRUD操作，支持分页、筛选、批量操作
- `Level.js`: 等级CRUD操作

**控制器**
- `wordController.js`: 处理单词相关请求
- `levelController.js`: 处理等级相关请求

**路由**
- `GET /api/levels`: 获取等级列表
- `GET /api/words/random`: 获取随机单词（小程序使用）
- `GET /api/words`: 获取单词列表（管理后台使用）
- `POST /api/words`: 创建单词
- `PUT /api/words/:id`: 更新单词
- `DELETE /api/words/:id`: 删除单词
- `POST /api/words/batch/import`: 批量导入
- `POST /api/words/batch/delete`: 批量删除

#### 3. 管理后台

**功能模块**
- 单词管理：列表展示、筛选、搜索、增删改查
- 等级管理：配置等级信息、颜色、排序
- 批量导入：JSON格式批量导入单词

**技术实现**
- 原生JavaScript，无框架依赖
- Fetch API进行HTTP请求
- 模态框实现表单编辑
- 响应式布局

### 数据库设计

**levels表**
```sql
CREATE TABLE levels (
  id VARCHAR(20) PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  word_count INT DEFAULT 10,
  color VARCHAR(20) DEFAULT '#4A90E2',
  sort_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

**words表**
```sql
CREATE TABLE words (
  id INT AUTO_INCREMENT PRIMARY KEY,
  word VARCHAR(100) NOT NULL,
  chinese VARCHAR(200) NOT NULL,
  phonetic VARCHAR(100) DEFAULT '',
  level_id VARCHAR(20) NOT NULL,
  status TINYINT DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (level_id) REFERENCES levels(id) ON DELETE CASCADE
);
```

### 游戏机制

- **进度计算**：`policePosition = (当前题号 / 总题数) * 100%`
- **胜利条件**：完成所有单词（无论对错）
- **评级系统**：
  - 90%+ → 3星 🏆
  - 70-89% → 2星 🎉
  - 50-69% → 1星 👍
  - <50% → 0星 😅

## Adding New Features

### 添加新API接口

1. 在 `backend/src/models/` 中添加数据模型方法
2. 在 `backend/src/controllers/` 中添加控制器方法
3. 在 `backend/src/routes/` 中添加路由
4. 在小程序 `utils/api.js` 中添加接口调用方法

### 扩展单词库

方式1：通过管理后台
- 访问 http://localhost:3000/admin
- 使用"批量导入"功能上传JSON数据

方式2：直接操作数据库
```sql
INSERT INTO words (word, chinese, phonetic, level_id) VALUES
('example', '例子', '/ɪɡˈzɑːmpl/', 'primary');
```

### 添加新等级

1. 在管理后台"等级管理"中添加新等级
2. 或直接插入数据库：
```sql
INSERT INTO levels (id, name, word_count, color, sort_order) VALUES
('custom', '自定义', 10, '#FF5733', 6);
```

## Configuration

### 环境变量 (backend/.env)

```env
DB_HOST=localhost          # 数据库主机
DB_PORT=3306              # 数据库端口
DB_USER=root              # 数据库用户
DB_PASSWORD=              # 数据库密码
DB_NAME=learn_english     # 数据库名称
PORT=3000                 # 服务端口
NODE_ENV=development      # 环境
```

### API地址配置 (utils/api.js)

开发环境：
```javascript
const API_BASE_URL = 'http://localhost:3000/api';
```

生产环境：
```javascript
const API_BASE_URL = 'https://your-domain.com/api';
```

## Common Tasks

### 重置数据库

```bash
cd backend
npm run init-db
```

这会删除并重新创建数据库，插入示例数据。

### 查看API日志

后端使用 console.log 输出日志，运行 `npm run dev` 时可在终端查看。

### 调试小程序

1. 打开微信开发者工具的"调试器"
2. 查看 Console 输出
3. 查看 Network 面板的API请求
4. 查看 AppData 面板的页面数据

## Deployment

### 后端部署

1. 安装PM2：`npm install -g pm2`
2. 启动服务：`pm2 start backend/src/app.js --name learn-english`
3. 设置开机自启：`pm2 startup && pm2 save`

### 小程序发布

1. 修改 `utils/api.js` 中的API地址为生产环境
2. 在微信开发者工具中点击"上传"
3. 登录微信公众平台提交审核

## Notes

- 小程序使用 WXML（类似 HTML）和 WXSS（类似 CSS）
- 页面间通过 `wx.navigateTo` 和 `wx.redirectTo` 跳转
- 数据通过 URL 参数或全局变量传递
- 定时器需要在页面卸载时清理（`onUnload`）
- 后端使用 mysql2/promise 进行数据库操作
- 管理后台是纯静态页面，通过 Express 的 static 中间件提供服务
