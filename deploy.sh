#!/bin/bash

echo "🚀 ResumeRAG Deployment Script"
echo "================================"

# Check if we're in the right directory
if [ ! -d "frontend" ] || [ ! -d "backend" ]; then
    echo "❌ Please run this script from the ResumeRag root directory"
    exit 1
fi

echo "📦 Building Frontend..."
cd frontend
npm run build
if [ $? -eq 0 ]; then
    echo "✅ Frontend build successful"
else
    echo "❌ Frontend build failed"
    exit 1
fi

echo "🔧 Preparing Backend..."
cd ../backend
npm install
if [ $? -eq 0 ]; then
    echo "✅ Backend dependencies installed"
else
    echo "❌ Backend installation failed"
    exit 1
fi

echo "🎉 Ready for deployment!"
echo ""
echo "Next steps:"
echo "1. Push your code to GitHub"
echo "2. Deploy backend to Railway: https://railway.app"
echo "3. Deploy frontend to Netlify: https://netlify.com"
echo "4. Update environment variables"
echo ""
echo "See DEPLOYMENT_GUIDE.md for detailed instructions"
