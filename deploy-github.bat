@echo off
title Kitchen - Deploy to GitHub Pages

echo ================================================
echo    Push code to GitHub
echo    Repo: wiraphong-work/home-cooking-recipes
echo ================================================

cd /d "%~dp0"

:: Check for Git
where git >nul 2>nul
if errorlevel 1 (
    echo [X] Git not found. Please install Git.
    pause
    exit /b 1
)

:: Check for .git folder
if not exist ".git" (
    echo [!] Initializing Git repo...
    git init
    git remote add origin https://github.com/wiraphong-work/home-cooking-recipes.git
    git branch -M main
    echo [!] Please make sure you created the repo on GitHub first.
    pause
)

echo.
set /p MSG="Enter commit message (Default: update recipes): "
if "%MSG%"=="" set MSG=update recipes

git add .
git commit -m "%MSG%"

if errorlevel 1 (
    echo [!] No changes or error occurred.
    pause
    exit /b 0
)

:: Push to GitHub
git push -u origin main

if errorlevel 1 (
    echo [X] Push failed. Check your internet or GitHub permissions.
    pause
    exit /b 1
)

echo ================================================
echo    [OK] Push Successful!
echo ================================================
pause