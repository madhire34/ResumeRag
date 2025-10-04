# Resume RAG Backend

AI-powered resume analysis and search backend using RAG (Retrieval-Augmented Generation) with OpenAI embeddings.

## Features

- **PDF Resume Upload**: Upload and parse PDF resumes
- **AI Skills Extraction**: Automatically extract technical skills using OpenAI
- **Vector Embeddings**: Generate embeddings for semantic search
- **RAG Search**: Intelligent resume search using vector similarity
- **RESTful API**: Complete CRUD operations for resume management

## API Endpoints

### Resume Management
- `POST /api/resumes/upload` - Upload a PDF resume
- `GET /api/resumes` - Get all resumes (names and skills only)
- `GET /api/resumes/:id` - Get specific resume details
- `DELETE /api/resumes/:id` - Delete a resume

### Search
- `POST /api/resumes/search` - Search resumes using natural language queries

## Environment Variables

Create a `.env` file in the backend directory:

```env
MONGO_URI=mongodb://localhost:27017/resumerag
PORT=8000
OPENAI_API_KEY=your_openai_api_key_here
CORS_ORIGIN=http://localhost:3000
```

## Installation

```bash
npm install
```

## Running the Server

```bash
npm start
# or for development
npm run dev
```

## Dependencies

- Express.js - Web framework
- MongoDB with Mongoose - Database
- OpenAI API - AI embeddings and text generation
- Multer - File upload handling
- PDF-parse - PDF text extraction
- CORS - Cross-origin resource sharing





