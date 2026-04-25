@echo off
chcp 65001 >nul
title ครัวบ้านๆ - Build Production

echo ================================================
echo   Build เว็บ ครัวบ้านๆ สำหรับ deploy
echo ================================================
echo.

cd /d "%~dp0"

if not exist "node_modules" (
    echo [!] กำลัง install package...
    call npm install
    if errorlevel 1 (
        echo [X] install ไม่สำเร็จ
        pause
        exit /b 1
    )
)

echo กำลัง build...
echo.
call npm run build

if errorlevel 1 (
    echo.
    echo [X] Build ไม่สำเร็จ
    pause
    exit /b 1
)

echo.
echo ================================================
echo   [OK] Build เสร็จเรียบร้อย!
echo   ไฟล์อยู่ในโฟลเดอร์ dist/
echo ================================================
echo.
pause
