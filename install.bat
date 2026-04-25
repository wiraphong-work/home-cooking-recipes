@echo off
chcp 65001 >nul
title ครัวบ้านๆ - Install Packages

echo ================================================
echo   ติดตั้ง package สำหรับเว็บ ครัวบ้านๆ
echo   (ทำครั้งแรกครั้งเดียว)
echo ================================================
echo.

cd /d "%~dp0"

REM เช็คว่ามี Node.js หรือยัง
where node >nul 2>nul
if errorlevel 1 (
    echo [X] ยังไม่ได้ลง Node.js
    echo.
    echo กรุณาดาวน์โหลดและติดตั้ง Node.js ก่อน:
    echo https://nodejs.org/
    echo.
    echo เลือก LTS version ติดตั้งให้เสร็จ ปิด-เปิด Terminal ใหม่ แล้วกดไฟล์นี้อีกครั้ง
    echo.
    pause
    exit /b 1
)

echo เจอ Node.js แล้ว:
node --version
echo npm:
npm --version
echo.

echo กำลัง install package... (ใช้เวลา 1-3 นาที)
echo.
call npm install

if errorlevel 1 (
    echo.
    echo [X] install ไม่สำเร็จ ลองใหม่อีกครั้ง
    pause
    exit /b 1
)

echo.
echo ================================================
echo   [OK] เรียบร้อย พร้อมใช้งาน!
echo.
echo   ขั้นตอนต่อไป: ดับเบิลคลิก start-dev.bat
echo ================================================
echo.
pause
