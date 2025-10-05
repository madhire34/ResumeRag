# ResumeRAG Frontend

Modern React frontend for the ResumeRAG application that allows users to upload, analyze, and search through resumes with AI.

## Features

- Modern UI with responsive design
- Resume upload with drag-and-drop functionality
- AI-powered resume search
- User authentication
- Dashboard for managing resumes

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm or yarn

### Installation

1. Clone the repository
2. Navigate to the frontend directory:
   ```
   cd frontend
   ```
3. Install dependencies:
   ```
   npm install
   ```
4. Create a `.env` file with the following content:
   ```
   VITE_API_URL=http://localhost:8000
   ```

### Development

Start the development server:

```
npm run dev
```

The application will be available at http://localhost:3000.

### Building for Production

Build the application:

```
npm run build
```

The built files will be in the `dist` directory.

## Deployment

The application is configured for deployment to Netlify using GitHub Actions. The workflow is defined in `.github/workflows/deploy.yml`.

### Live Deployment

The frontend is deployed at: [resumerag-mahanandireddy.netlify.app](https://resumerag-mahanandireddy.netlify.app)

### Required Secrets for GitHub Actions

- `NETLIFY_AUTH_TOKEN`: Your Netlify authentication token
- `NETLIFY_SITE_ID`: Your Netlify site ID
- `VITE_API_URL`: URL of the backend API (currently set to https://resumerag-hdr3.onrender.com)

## Connecting to the Backend

The frontend is configured to connect to the backend API at the URL specified in the `VITE_API_URL` environment variable. In development, this defaults to `http://localhost:8000`, but in production it connects to the Render backend at https://resumerag-hdr3.onrender.com.

## License

MIT