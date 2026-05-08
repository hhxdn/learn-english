# 双仓库推送说明

本项目同时维护在GitHub和Gitee两个平台。

## 仓库地址

- **GitHub**: https://github.com/hhxdn/learn-english.git
- **Gitee**: https://gitee.com/hhxdn/learn-english.git

## 推送方式

### 方式1：使用推送脚本（推荐）

**Linux/Mac:**
```bash
./push-all.sh
```

**Windows:**
```bash
push-all.bat
```

或者双击 `push-all.bat` 文件

### 方式2：手动推送

```bash
# 推送到Gitee
git push origin main

# 推送到GitHub
git push github main
```

### 方式3：一次性推送到所有远程仓库

```bash
git push --all
```

## 远程仓库配置

查看当前配置：
```bash
git remote -v
```

输出：
```
github  https://github.com/hhxdn/learn-english.git (fetch)
github  https://github.com/hhxdn/learn-english.git (push)
origin  https://gitee.com/hhxdn/learn-english.git (fetch)
origin  https://gitee.com/hhxdn/learn-english.git (push)
```

## 注意事项

1. 每次提交代码后，记得同时推送到两个仓库
2. 推荐使用 `push-all` 脚本，确保不会遗漏任何一个仓库
3. 如果某个仓库推送失败，脚本会提示错误信息

## 常见问题

### Q: 推送失败怎么办？
A: 检查网络连接，确认有权限访问对应仓库

### Q: 如何只推送到一个仓库？
A: 使用 `git push origin main` (Gitee) 或 `git push github main` (GitHub)

### Q: 如何查看推送历史？
A: 使用 `git log --oneline` 查看提交历史
