@echo off
chcp 65001 >nul
title ครัวบ้านๆ - Deploy to GitHub Pages

echo ================================================
echo    Push โค้ดขึ้น GitHub
echo    Repo: wiraphong-work/home-cooking-recipes
echo    URL:  https://wiraphong-work.github.io/home-cooking-recipes/
echo ================================================
echo.

cd /d "%~dp0"

:: เช็คว่ามี git หรือไม่
where git >nul 2>nul
if errorlevel 1 (
    echo [X] ยังไม่ได้ลง Git
    echo ดาวน์โหลดที่: https://git-scm.com/download/win
    pause
    exit /b 1
)

:: เช็คว่าเป็น git repo หรือยัง
if not exist ".git" (
    echo [!] ยังไม่ได้สร้าง Git repo - เริ่มเซ็ตอัพ...
    echo.
    git init
    git remote add origin https://github.com/wiraphong-work/home-cooking-recipes.git
    git branch -M main
    echo.
    echo [!] เปิดเบราว์เซอร์ไปสร้าง repo เปล่าก่อน:
    echo      https://github.com/new
    echo      - Repository name: home-cooking-recipes
    echo.
    pause
)

echo.
set /p MSG="ใส่ข้อความ commit (Enter เพื่อใช้ค่าเริ่มต้น): "

if "%MSG%"=="" set MSG=update recipes

git add .
git commit -m "%MSG%"

if errorlevel 1 (
    echo.
    echo [!] ไม่มีอะไรเปลี่ยนแปลง หรือมี error
    pause
    exit /b 0
)

:: พยายาม push
git push -u origin main

if errorlevel 1 (
    echo.
    echo [X] push ไม่สำเร็จ
    echo.
    echo เช็คว่า:
    echo 1. สร้าง repo ใน GitHub หรือยัง
    echo 2. ตั้งค่าสิทธิ์การเขียน (Permissions) ใน GitHub หรือยัง
    pause
    exit /b 1
)

echo.
echo ================================================
echo    [OK] Push สำเร็จ!
echo    ไปดู Action ที่: https://github.com/wiraphong-work/home-cooking-recipes/actions
echo ================================================
echo.
pause