# 🚀 ResumeRAG Deployment Guide

## Quick Deployment Links

### 🌐 **Frontend (React App)**
**Deploy to Netlify:**
1. Go to [netlify.com](https://netlify.com)
2. Sign up/Login with GitHub
3. Click "New site from Git"
4. Connect your GitHub repository
5. Set build command: `npm run build`
6. Set publish directory: `build`
7. Deploy!

**Alternative - Vercel:**
1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Set framework: Create React App
4. Deploy!

### 🔧 **Backend (Node.js API)**
**Deploy to Railway:**
1. Go to [railway.app](https://railway.app)
2. Sign up/Login with GitHub
3. Click "New Project"
4. Connect your GitHub repository
5. Select the backend folder
6. Add environment variables (see below)
7. Deploy!

**Alternative - Render:**
1. Go to [render.com](https://render.com)
2. Create new Web Service
3. Connect GitHub repository
4. Set build command: `npm install`
5. Set start command: `npm start`
6. Add environment variables
7. Deploy!

## 🔑 Environment Variables

### Backend Environment Variables
```
OPENAI_API_KEY=your_openai_api_key_here
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/resumerag
PORT=8000
CORS_ORIGIN=https://your-frontend-url.netlify.app
```

### Frontend Environment Variables
```
REACT_APP_API_URL=https://your-backend-url.railway.app
```

## 📋 Step-by-Step Deployment

### 1. **Prepare Backend for Deployment**

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Test build
npm start
```

### 2. **Deploy Backend to Railway**

1. **Create Railway Account:**
   - Go to [railway.app](https://railway.app)
   - Sign up with GitHub

2. **Create New Project:**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your ResumeRag repository
   - Select the `backend` folder

3. **Configure Environment Variables:**
   - Go to Variables tab
   - Add the environment variables listed above

4. **Deploy:**
   - Railway will automatically deploy
   - Note the generated URL (e.g., `https://your-app.railway.app`)

### 3. **Deploy Frontend to Netlify**

1. **Create Netlify Account:**
   - Go to [netlify.com](https://netlify.com)
   - Sign up with GitHub

2. **Create New Site:**
   - Click "New site from Git"
   - Connect your GitHub repository
   - Select the `frontend` folder

3. **Configure Build Settings:**
   - Build command: `npm run build`
   - Publish directory: `build`
   - Add environment variable: `REACT_APP_API_URL=https://your-backend-url.railway.app`

4. **Deploy:**
   - Click "Deploy site"
   - Netlify will build and deploy your app

### 4. **Update Frontend API URL**

After getting your backend URL, update the frontend to use it:

1. **In Netlify:**
   - Go to Site settings
   - Environment variables
   - Add `REACT_APP_API_URL` with your backend URL

2. **Redeploy:**
   - Trigger a new deployment

## 🔧 **Alternative Deployment Options**

### **Backend Alternatives:**
- **Heroku**: [heroku.com](https://heroku.com)
- **Render**: [render.com](https://render.com)
- **DigitalOcean App Platform**: [digitalocean.com](https://digitalocean.com)

### **Frontend Alternatives:**
- **Vercel**: [vercel.com](https://vercel.com)
- **GitHub Pages**: [pages.github.com](https://pages.github.com)
- **Firebase Hosting**: [firebase.google.com](https://firebase.google.com)

## 🎯 **Quick Deploy Commands**

### **Using Netlify CLI:**
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Deploy frontend
cd frontend
netlify deploy --prod --dir=build
```

### **Using Vercel CLI:**
```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy frontend
cd frontend
vercel --prod
```

## 🚀 **Expected Results**

After deployment, you'll have:
- **Frontend URL**: `https://your-app-name.netlify.app`
- **Backend URL**: `https://your-app-name.railway.app`

## 🔍 **Testing Your Deployment**

1. **Test Backend:**
   - Visit: `https://your-backend-url.railway.app/api/resumes`
   - Should return JSON response

2. **Test Frontend:**
   - Visit: `https://your-frontend-url.netlify.app`
   - Should load the ResumeRAG interface

3. **Test Integration:**
   - Try uploading a resume
   - Try searching for candidates
   - Check browser console for any errors

## 🎉 **You're Live!**

Your ResumeRAG application will be live and accessible to anyone on the internet!

---

**Need help? Check the deployment logs in your chosen platform's dashboard.**
