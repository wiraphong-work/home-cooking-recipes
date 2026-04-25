@echo off
chcp 65001 >nul
title ครัวบ้านๆ - Dev Server

echo ================================================
echo   เริ่มต้นเซิร์ฟเวอร์ ครัวบ้านๆ
echo ================================================
echo.
echo กำลังเปิดเว็บที่ http://localhost:4321
echo.
echo กด Ctrl+C เพื่อปิดเซิร์ฟเวอร์
echo.

cd /d "%~dp0"

REM เช็คว่ามี node_modules หรือยัง
if not exist "node_modules" (
    echo [!] ยังไม่ได้ลง package - กำลัง install...
    echo.
    call npm install
    if errorlevel 1 (
        echo.
        echo [X] npm install ไม่สำเร็จ
        pause
        exit /b 1
    )
)

REM รอ 2 วินาทีแล้วเปิดเบราว์เซอร์
start "" cmd /c "timeout /t 4 /nobreak >nul && start http://localhost:4321"

call npm run dev

pause
