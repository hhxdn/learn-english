@echo off
REM Windows批处理脚本 - 同时推送到GitHub和Gitee

echo 正在推送到 Gitee...
git push origin main

if %errorlevel% neq 0 (
    echo X Gitee 推送失败
    exit /b 1
)

echo √ Gitee 推送成功
echo.

echo 正在推送到 GitHub...
git push github main

if %errorlevel% neq 0 (
    echo X GitHub 推送失败
    exit /b 1
)

echo √ GitHub 推送成功
echo.
echo 🎉 所有仓库推送完成！
