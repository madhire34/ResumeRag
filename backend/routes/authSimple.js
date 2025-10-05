import express from "express";
import jwt from "jsonwebtoken";

const router = express.Router();

// JWT Secret (in production, use environment variable)
const JWT_SECRET = process.env.JWT_SECRET || "resumerag_secret_key_2024";

// Generate JWT Token
const generateToken = (userId) => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '24h' });
};

// Demo credentials
const demoUsers = {
  'admin@mail.com': { password: 'admin123', name: 'Admin User', role: 'admin' },
  'demo@resumerag.com': { password: 'demo123', name: 'Demo User', role: 'demo' },
  'hr@company.com': { password: 'hr123', name: 'HR Manager', role: 'user' }
};

// Login user
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ 
        error: "Email and password are required" 
      });
    }

    const user = demoUsers[email];
    if (user && user.password === password) {
      const token = generateToken(Date.now().toString());
      return res.json({
        message: 'Logged in successfully',
        user: {
          id: Date.now().toString(),
          name: user.name,
          email: email,
          role: user.role,
        },
        token: token,
      });
    } else {
      return res.status(401).json({ 
        error: "Invalid email or password" 
      });
    }
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ 
      error: "Internal server error" 
    });
  }
});

// Demo login
router.post("/demo-login", async (req, res) => {
  try {
    const { email } = req.body;
    
    const user = demoUsers[email] || { name: 'Demo User', role: 'demo' };
    const token = generateToken(Date.now().toString());
    
    res.json({
      message: `Logged in as ${user.name}`,
      user: {
        id: Date.now().toString(),
        name: user.name,
        email: email,
        role: user.role,
      },
      token: token,
    });
  } catch (error) {
    console.error("Demo login error:", error);
    res.status(500).json({ 
      error: "Internal server error" 
    });
  }
});

// Register new user (demo only)
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role = 'user' } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({ 
        error: "Name, email, and password are required" 
      });
    }

    if (password.length < 6) {
      return res.status(400).json({ 
        error: "Password must be at least 6 characters long" 
      });
    }

    // Check if user already exists
    if (demoUsers[email]) {
      return res.status(400).json({ 
        error: "User already exists" 
      });
    }

    // Generate token
    const token = generateToken(Date.now().toString());

    res.status(201).json({
      message: 'User registered successfully (Demo Mode)',
      user: {
        id: Date.now().toString(),
        name: name,
        email: email,
        role: role,
      },
      token: token,
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ 
      error: "Internal server error" 
    });
  }
});

export default router;
