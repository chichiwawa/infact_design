@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo 홈페이지를 http://localhost:4000 에서 엽니다. 이 창을 닫으면 종료됩니다.
start "" http://localhost:4000
node server.js
