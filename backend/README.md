# 后端服务使用指南

## 环境要求

- Node.js 14+ 
- MySQL 5.7+

## 安装步骤

### 1. 安装依赖

```bash
cd backend
npm install
```

### 2. 配置数据库

编辑 `backend/.env` 文件，配置数据库连接信息：

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=learn_english
PORT=3000
```

### 3. 初始化数据库

```bash
npm run init-db
```

这将自动创建数据库、表结构并插入示例数据。

### 4. 启动服务

开发模式（自动重启）：
```bash
npm run dev
```

生产模式：
```bash
npm start
```

服务启动后访问：
- 管理后台：http://localhost:3000/admin
- API接口：http://localhost:3000/api

## API接口文档

### 等级管理

#### 获取等级列表
```
GET /api/levels
```

响应示例：
```json
{
  "code": 200,
  "message": "success",
  "data": [
    {
      "id": "primary",
      "name": "小学",
      "word_count": 10,
      "color": "#FFB6C1",
      "sort_order": 1,
      "total_words": 10
    }
  ]
}
```

#### 获取单个等级
```
GET /api/levels/:id
```

#### 创建等级
```
POST /api/levels
Content-Type: application/json

{
  "id": "custom",
  "name": "自定义",
  "word_count": 10,
  "color": "#4A90E2",
  "sort_order": 6
}
```

#### 更新等级
```
PUT /api/levels/:id
Content-Type: application/json

{
  "name": "小学（更新）",
  "word_count": 15,
  "color": "#FFB6C1",
  "sort_order": 1
}
```

#### 删除等级
```
DELETE /api/levels/:id
```

### 单词管理

#### 获取单词列表
```
GET /api/words?level_id=primary&page=1&limit=20&keyword=apple
```

参数：
- `level_id`: 等级ID（可选）
- `page`: 页码（默认1）
- `limit`: 每页数量（默认50）
- `keyword`: 搜索关键词（可选）

#### 获取随机单词（小程序使用）
```
GET /api/words/random?level_id=primary&count=10
```

参数：
- `level_id`: 等级ID（必填）
- `count`: 单词数量（默认10）

#### 获取单个单词
```
GET /api/words/:id
```

#### 创建单词
```
POST /api/words
Content-Type: application/json

{
  "word": "hello",
  "chinese": "你好",
  "phonetic": "/həˈloʊ/",
  "level_id": "primary"
}
```

#### 更新单词
```
PUT /api/words/:id
Content-Type: application/json

{
  "word": "hello",
  "chinese": "你好",
  "phonetic": "/həˈloʊ/",
  "level_id": "primary",
  "status": 1
}
```

#### 删除单词
```
DELETE /api/words/:id
```

#### 批量导入单词
```
POST /api/words/batch/import
Content-Type: application/json

{
  "words": [
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
}
```

#### 批量删除单词
```
POST /api/words/batch/delete
Content-Type: application/json

{
  "ids": [1, 2, 3]
}
```

## 管理后台使用

访问 http://localhost:3000/admin 进入管理后台。

### 功能说明

1. **单词管理**
   - 查看所有单词
   - 按等级筛选
   - 搜索单词
   - 添加/编辑/删除单词
   - 批量删除

2. **等级管理**
   - 查看所有等级
   - 添加/编辑/删除等级
   - 设置等级颜色和排序

3. **批量导入**
   - 支持JSON格式批量导入
   - 查看导入示例
   - 一次性导入多个单词

## 小程序配置

修改小程序 `utils/api.js` 中的 API 地址：

```javascript
const API_BASE_URL = 'http://localhost:3000/api';
```

如果部署到服务器，改为实际域名：

```javascript
const API_BASE_URL = 'https://your-domain.com/api';
```

注意：微信小程序要求使用 HTTPS，本地开发需要在小程序开发工具中关闭"不校验合法域名"。

## 常见问题

### 1. 数据库连接失败
- 检查MySQL服务是否启动
- 检查 `.env` 文件中的数据库配置
- 确认数据库用户有足够权限

### 2. 端口被占用
修改 `.env` 文件中的 `PORT` 配置

### 3. 小程序无法连接后端
- 确认后端服务已启动
- 检查小程序中的 API 地址配置
- 开发工具中关闭"校验合法域名"

## 部署到生产环境

1. 安装 PM2（进程管理器）
```bash
npm install -g pm2
```

2. 启动服务
```bash
cd backend
pm2 start src/app.js --name learn-english
```

3. 设置开机自启
```bash
pm2 startup
pm2 save
```

4. 查看日志
```bash
pm2 logs learn-english
```

5. 重启服务
```bash
pm2 restart learn-english
```
