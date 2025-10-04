@echo off
echo 🚀 ResumeRAG Quick Deploy Script
echo ================================

echo.
echo 📦 Building Frontend...
cd frontend
call npm run build
if %errorlevel% neq 0 (
    echo ❌ Frontend build failed!
    pause
    exit /b 1
)
echo ✅ Frontend build successful!

echo.
echo 🔧 Preparing Backend...
cd ..\backend
call npm install
if %errorlevel% neq 0 (
    echo ❌ Backend installation failed!
    pause
    exit /b 1
)
echo ✅ Backend ready!

echo.
echo 🎉 Your app is ready for deployment!
echo.
echo 📋 Next Steps:
echo 1. Push your code to GitHub
echo 2. Deploy backend to Railway: https://railway.app
echo 3. Deploy frontend to Vercel: https://vercel.com
echo 4. See QUICK_DEPLOY.md for detailed instructions
echo.
echo 🌐 Expected URLs:
echo - Frontend: https://your-app.vercel.app
echo - Backend: https://your-app.railway.app
echo.
pause
