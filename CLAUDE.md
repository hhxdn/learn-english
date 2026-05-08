# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

这是一个英语单词学习微信小程序，采用"警察抓小偷"的游戏形式。用户通过输入正确的英文单词来让警察靠近小偷，完成所有单词即可抓住小偷。

### 核心功能
- 多等级支持：小学、初中、高中、四级、六级
- 游戏化学习：警察追捕小偷的进度条展示
- 实时反馈：答对前进，答错显示正确答案
- 成绩统计：正确率、用时、星级评价

## Project Structure

```
file-transform/
├── app.js                 # 小程序入口文件
├── app.json              # 全局配置
├── app.wxss              # 全局样式
├── sitemap.json          # 索引配置
├── data/
│   └── words.js          # 单词数据库和等级配置
├── utils/
│   └── game.js           # 游戏工具函数
└── pages/
    ├── index/            # 等级选择页面
    │   ├── index.js
    │   ├── index.json
    │   ├── index.wxml
    │   └── index.wxss
    ├── game/             # 游戏主页面
    │   ├── game.js
    │   ├── game.json
    │   ├── game.wxml
    │   └── game.wxss
    └── result/           # 结果页面
        ├── result.js
        ├── result.json
        ├── result.wxml
        └── result.wxss
```

## Development Commands

### 运行小程序
1. 安装微信开发者工具：https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html
2. 打开微信开发者工具
3. 导入项目，选择 `D:\my_projects\file-transform` 目录
4. 点击"编译"按钮运行

### 调试
- 使用微信开发者工具的调试器查看 Console 输出
- 使用 AppData 面板查看页面数据
- 使用 Wxml 面板查看页面结构

## Architecture

### 数据流
1. **等级选择** (`pages/index`) → 用户选择难度等级
2. **游戏开始** (`pages/game`) → 从 `data/words.js` 加载对应等级的单词
3. **答题循环** → 用户输入 → 判断正误 → 更新进度 → 下一题
4. **游戏结束** (`pages/result`) → 显示统计数据和评级

### 核心模块

#### 1. 单词数据库 (`data/words.js`)
- `wordDatabase`: 包含5个等级的单词数据
  - 每个单词包含：word（英文）、chinese（中文）、phonetic（音标）
- `levelConfig`: 等级配置（名称、单词数量、颜色）

#### 2. 游戏工具 (`utils/game.js`)
- `getRandomWords(level, count)`: 获取随机单词列表
- `calculateDistance(current, total)`: 计算警察位置百分比
- `checkAnswer(userInput, correctWord)`: 检查答案正确性
- `formatTime(seconds)`: 格式化时间显示

#### 3. 游戏逻辑 (`pages/game/game.js`)
- 进度追踪：通过 `policePosition` 控制警察图标位置
- 答题判断：正确前进，错误显示答案但不前进
- 计时器：记录游戏用时
- 状态管理：当前题目、正确/错误数、用户输入等

### 游戏机制
- **进度计算**：`policePosition = (当前题号 / 总题数) * 100%`
- **胜利条件**：完成所有单词（无论对错）
- **评级系统**：
  - 90%+ → 3星 🏆
  - 70-89% → 2星 🎉
  - 50-69% → 1星 👍
  - <50% → 0星 😅

## Adding New Features

### 添加新等级
1. 在 `data/words.js` 的 `wordDatabase` 中添加新等级数据
2. 在 `levelConfig` 中添加对应配置
3. 等级会自动显示在首页

### 扩展单词库
直接编辑 `data/words.js` 中对应等级的单词数组，添加更多单词对象。

### 修改游戏难度
在 `data/words.js` 的 `levelConfig` 中调整 `wordCount` 参数。

## Styling

- 使用渐变背景营造游戏氛围
- 采用卡片式设计，圆角和阴影增强层次感
- 响应式单位 rpx（responsive pixel）适配不同屏幕
- 动画效果：进度条过渡、图标弹跳、按钮点击反馈

## Notes

- 小程序使用 WXML（类似 HTML）和 WXSS（类似 CSS）
- 页面间通过 `wx.navigateTo` 和 `wx.redirectTo` 跳转
- 数据通过 URL 参数传递（如等级、成绩）
- 定时器需要在页面卸载时清理（`onUnload`）
