@echo off
echo.
echo ===================================
echo    AI Chat App Installation
echo ===================================
echo.

echo Checking Node.js installation...
node -v
if %ERRORLEVEL% NEQ 0 (
    echo Error: Node.js is not installed!
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo.
echo Installing dependencies...
call npm install

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo Error during installation! Trying to fix...
    echo.
    echo Clearing npm cache...
    call npm cache clean --force
    
    echo.
    echo Removing node_modules...
    rmdir /s /q node_modules
    
    echo.
    echo Reinstalling dependencies...
    call npm install
)

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo Installation failed! Please check the error messages above.
    pause
    exit /b 1
)

echo.
echo ===================================
echo    Installation Complete!
echo ===================================
echo.
echo Starting the development server...
echo.
call npm start
