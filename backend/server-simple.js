import express from "express";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(cors({
    origin: ['http://localhost:3000', 'https://resumerag-mahanandireddy.netlify.app'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development'
    });
});

// Demo data
const demoResumes = [
    {
        _id: "demo1",
        name: "John Doe",
        title: "Senior Python Developer",
        email: "john.doe@email.com",
        skills: ["Python", "Django", "PostgreSQL", "AWS", "Docker"],
        summary: "Experienced Python developer with 5+ years of experience in web development and cloud technologies.",
        createdAt: new Date(),
        matchScore: 95
    },
    {
        _id: "demo2",
        name: "Jane Smith", 
        title: "Full Stack Developer",
        email: "jane.smith@email.com",
        skills: ["React", "Node.js", "MongoDB", "TypeScript", "Express"],
        summary: "Versatile full-stack developer with expertise in modern web technologies and agile development.",
        createdAt: new Date(),
        matchScore: 88
    },
    {
        _id: "demo3",
        name: "Mike Johnson",
        title: "Python Backend Developer", 
        email: "mike.johnson@email.com",
        skills: ["Python", "FastAPI", "Redis", "Kubernetes", "Microservices"],
        summary: "Backend specialist with deep knowledge of Python frameworks and microservices architecture.",
        createdAt: new Date(),
        matchScore: 82
    },
    {
        _id: "demo4",
        name: "Sarah Wilson",
        title: "Data Engineer",
        email: "sarah.wilson@email.com", 
        skills: ["Python", "Pandas", "Apache Spark", "SQL", "Data Pipeline"],
        summary: "Data engineering professional with experience in building scalable data pipelines and analytics.",
        createdAt: new Date(),
        matchScore: 78
    }
];

// Auth routes
app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    
    // Demo credentials
    const demoUsers = {
        'admin@mail.com': { password: 'admin123', name: 'Admin User', role: 'admin' },
        'demo@resumerag.com': { password: 'demo123', name: 'Demo User', role: 'demo' },
        'hr@company.com': { password: 'hr123', name: 'HR Manager', role: 'user' }
    };
    
    const user = demoUsers[email];
    if (user && user.password === password) {
        res.json({
            message: 'Logged in successfully',
            user: {
                id: Date.now().toString(),
                name: user.name,
                email: email,
                role: user.role,
            },
            token: 'demo_token_' + Date.now(),
        });
    } else {
        res.status(400).json({ message: 'Invalid credentials' });
    }
});

app.post('/api/auth/demo-login', (req, res) => {
    const { email } = req.body;
    
    const demoUsers = {
        'admin@mail.com': { name: 'Admin User', role: 'admin' },
        'demo@resumerag.com': { name: 'Demo User', role: 'demo' },
        'hr@company.com': { name: 'HR Manager', role: 'user' }
    };
    
    const user = demoUsers[email] || { name: 'Demo User', role: 'demo' };
    
    res.json({
        message: `Logged in as ${user.name}`,
        user: {
            id: Date.now().toString(),
            name: user.name,
            email: email,
            role: user.role,
        },
        token: 'demo_token_' + Date.now(),
    });
});

// Resume routes
app.get('/api/resumes', (req, res) => {
    res.json({ resumes: demoResumes });
});

app.post('/api/resumes/upload', (req, res) => {
    // Simulate file upload processing
    setTimeout(() => {
        res.json({ 
            message: 'Resume uploaded and processed successfully!',
            demo: true
        });
    }, 1000);
});

app.post('/api/resumes/search', (req, res) => {
    const { query } = req.body;
    
    if (!query) {
        return res.status(400).json({ error: "Search query is required." });
    }
    
    // Simulate search processing
    setTimeout(() => {
        const searchResults = {
            query: query,
            total_candidates: demoResumes.length,
            top_candidates: demoResumes.map(resume => ({
                id: resume._id,
                name: resume.name,
                title: resume.title,
                experience: "5 years",
                location: "San Francisco, CA",
                skills: resume.skills,
                match_score: resume.matchScore,
                resume_url: "#",
                summary: resume.summary
            })),
            rag_summary: `Based on the search for "${query}", here are the top candidates with relevant skills and experience.`
        };
        
        res.json(searchResults);
    }, 500);
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        error: 'Something went wrong!',
        message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
    });
});

app.listen(PORT, () => {
    console.log(`🚀 Simple Server running on port ${PORT}`);
    console.log(`📊 Demo mode - serving ${demoResumes.length} demo resumes`);
});
