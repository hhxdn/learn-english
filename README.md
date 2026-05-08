# 英语单词追捕 - 微信小程序

一个寓教于乐的英语单词学习小程序，通过"警察抓小偷"的游戏形式帮助用户记忆单词。

## 功能特点

- 🎮 **游戏化学习**：警察追捕小偷的趣味形式
- 📚 **多等级支持**：小学、初中、高中、四级、六级
- ⚡ **即时反馈**：答对前进，答错显示正确答案
- 📊 **成绩统计**：正确率、用时、星级评价
- 🎨 **精美界面**：渐变色彩、流畅动画
- 🔧 **管理后台**：可视化管理单词和等级
- 💾 **数据库存储**：MySQL持久化存储
- 📥 **批量导入**：支持JSON格式批量导入单词

## 项目结构

```
Learn-English/
├── pages/              # 小程序页面
│   ├── index/          # 等级选择页
│   ├── game/           # 游戏主页面
│   └── result/         # 结果页面
├── utils/              # 工具函数
│   ├── api.js          # API接口封装
│   └── game.js         # 游戏逻辑
├── data/               # 本地数据（备用）
│   └── words.js        # 单词数据
├── backend/            # 后端服务
│   ├── src/
│   │   ├── config/     # 配置文件
│   │   ├── controllers/# 控制器
│   │   ├── models/     # 数据模型
│   │   ├── routes/     # 路由
│   │   └── app.js      # 应用入口
│   ├── public/admin/   # 管理后台前端
│   ├── database.sql    # 数据库脚本
│   └── package.json
├── app.js              # 小程序入口
├── app.json            # 全局配置
└── app.wxss            # 全局样式
```

## 快速开始

### 1. 启动后端服务

```bash
# 进入后端目录
cd backend

# 安装依赖
npm install

# 配置数据库（编辑 .env 文件）
cp .env.example .env

# 初始化数据库
npm run init-db

# 启动服务
npm run dev
```

后端服务启动后：
- 管理后台：http://localhost:3000/admin
- API接口：http://localhost:3000/api

详细说明请查看 [backend/README.md](backend/README.md)

### 2. 运行小程序

1. 下载并安装[微信开发者工具](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)

2. 打开微信开发者工具，导入项目

3. 选择项目目录：`Learn-English`

4. 在"详情" → "本地设置"中，勾选"不校验合法域名"

5. 点击"编译"运行小程序

## 游戏规则

1. 选择你的等级（小学/初中/高中/四级/六级）
2. 看到中文释义和音标，输入对应的英文单词
3. 答对一题，警察就向小偷靠近一步
4. 完成所有单词，警察抓住小偷，游戏胜利！
5. 根据正确率获得星级评价

## 管理后台

访问 http://localhost:3000/admin 使用管理后台。

### 功能

- **单词管理**：增删改查单词，支持筛选和搜索
- **等级管理**：管理等级配置，设置颜色和排序
- **批量导入**：JSON格式批量导入单词

### 批量导入格式

```json
[
  {
    "word": "hello",
    "chinese": "你好",
    "phonetic": "/həˈloʊ/",
    "level_id": "primary"
  },
  {
    "word": "world",
    "chinese": "世界",
    "phonetic": "/wɜːrld/",
    "level_id": "primary"
  }
]
```

## 技术栈

### 小程序端
- 微信小程序原生框架
- JavaScript ES6+
- WXML / WXSS

### 后端
- Node.js + Express
- MySQL 数据库
- RESTful API

### 管理后台
- 原生 HTML/CSS/JavaScript
- 响应式设计

## 数据库设计

### levels 表（等级配置）
- id: 等级ID
- name: 等级名称
- word_count: 每次游戏单词数量
- color: 主题颜色
- sort_order: 排序

### words 表（单词）
- id: 主键
- word: 英文单词
- chinese: 中文释义
- phonetic: 音标
- level_id: 所属等级
- status: 状态（启用/禁用）

## API接口

详细API文档请查看 [backend/README.md](backend/README.md)

主要接口：
- `GET /api/levels` - 获取等级列表
- `GET /api/words/random` - 获取随机单词
- `POST /api/words` - 创建单词
- `POST /api/words/batch/import` - 批量导入

## 开发计划

- [x] 基础游戏功能
- [x] 多等级支持
- [x] 成绩统计
- [x] 后端API
- [x] 管理后台
- [x] 批量导入
- [ ] 语音朗读
- [ ] 错题本功能
- [ ] 用户系统
- [ ] 排行榜
- [ ] 每日挑战

## 部署

### 后端部署

推荐使用 PM2 进行进程管理：

```bash
npm install -g pm2
cd backend
pm2 start src/app.js --name learn-english
pm2 save
```

### 小程序发布

1. 在管理后台配置好所有单词
2. 修改 `utils/api.js` 中的 API 地址为生产环境地址
3. 在微信开发者工具中点击"上传"
4. 登录微信公众平台提交审核

## 许可证

MIT License

## 联系方式

如有问题或建议，欢迎提交 Issue。
