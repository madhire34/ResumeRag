const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Deploying ResumeRAG to GitHub Pages...');

// Build the frontend
console.log('📦 Building frontend...');
execSync('npm run build', { stdio: 'inherit' });

// Create a simple index.html for GitHub Pages
const buildDir = path.join(__dirname, 'build');
const indexPath = path.join(buildDir, 'index.html');

if (fs.existsSync(indexPath)) {
    console.log('✅ Frontend build successful!');
    console.log('');
    console.log('📋 Next steps:');
    console.log('1. Push your code to GitHub');
    console.log('2. Go to your repository settings');
    console.log('3. Enable GitHub Pages');
    console.log('4. Select "Deploy from a branch"');
    console.log('5. Choose "main" branch and "/build" folder');
    console.log('6. Your site will be live at: https://yourusername.github.io/ResumeRag');
    console.log('');
    console.log('🔧 For backend deployment:');
    console.log('1. Go to https://railway.app');
    console.log('2. Deploy your backend folder');
    console.log('3. Get your API URL');
    console.log('4. Update frontend to use the API URL');
} else {
    console.log('❌ Build failed!');
    process.exit(1);
}
