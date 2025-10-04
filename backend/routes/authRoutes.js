import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

// JWT Secret (in production, use environment variable)
const JWT_SECRET = process.env.JWT_SECRET || "resumerag_secret_key_2024";

// Generate JWT Token
const generateToken = (userId) => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '24h' });
};

// Register new user
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
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ 
        error: "User with this email already exists" 
      });
    }

    // Create new user
    const user = new User({
      name,
      email,
      password,
      role
    });

    await user.save();

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ 
      error: "Failed to register user" 
    });
  }
});

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

    // Find user
    const user = await User.findOne({ email, isActive: true });
    if (!user) {
      return res.status(401).json({ 
        error: "Invalid email or password" 
      });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ 
        error: "Invalid email or password" 
      });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate token
    const token = generateToken(user._id);

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        lastLogin: user.lastLogin
      }
    });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ 
      error: "Failed to login" 
    });
  }
});

// Demo login (special endpoint for demo users)
router.post("/demo-login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Demo credentials
    const demoUsers = [
      {
        email: "admin@mail.com",
        password: "admin123",
        name: "Admin User",
        role: "admin"
      },
      {
        email: "demo@resumerag.com",
        password: "demo123",
        name: "Demo User",
        role: "demo"
      },
      {
        email: "hr@company.com",
        password: "hr123",
        name: "HR Manager",
        role: "user"
      }
    ];

    const demoUser = demoUsers.find(user => 
      user.email === email && user.password === password
    );

    if (!demoUser) {
      return res.status(401).json({ 
        error: "Invalid demo credentials" 
      });
    }

    // Check if demo user exists in database, if not create it
    let user = await User.findOne({ email: demoUser.email });
    if (!user) {
      user = new User({
        name: demoUser.name,
        email: demoUser.email,
        password: demoUser.password,
        role: demoUser.role
      });
      await user.save();
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate token
    const token = generateToken(user._id);

    res.json({
      message: "Demo login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        lastLogin: user.lastLogin
      }
    });

  } catch (error) {
    console.error("Demo login error:", error);
    res.status(500).json({ 
      error: "Failed to login with demo credentials" 
    });
  }
});

// Verify token middleware
export const verifyToken = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: "Access denied. No token provided." });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user || !user.isActive) {
      return res.status(401).json({ error: "Invalid token or user not found." });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Token verification error:", error);
    res.status(401).json({ error: "Invalid token." });
  }
};

// Get current user profile
router.get("/profile", verifyToken, async (req, res) => {
  try {
    res.json({
      user: req.user
    });
  } catch (error) {
    console.error("Profile fetch error:", error);
    res.status(500).json({ 
      error: "Failed to fetch profile" 
    });
  }
});

// Update user profile
router.put("/profile", verifyToken, async (req, res) => {
  try {
    const { name, email } = req.body;
    const userId = req.user._id;

    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;

    const user = await User.findByIdAndUpdate(
      userId, 
      updateData, 
      { new: true, runValidators: true }
    ).select('-password');

    res.json({
      message: "Profile updated successfully",
      user
    });

  } catch (error) {
    console.error("Profile update error:", error);
    res.status(500).json({ 
      error: "Failed to update profile" 
    });
  }
});

// Logout (client-side token removal)
router.post("/logout", verifyToken, async (req, res) => {
  try {
    res.json({
      message: "Logout successful"
    });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ 
      error: "Failed to logout" 
    });
  }
});

// Get all users (admin only)
router.get("/users", verifyToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ 
        error: "Access denied. Admin role required." 
      });
    }

    const users = await User.find({}, { password: 0 }).sort({ createdAt: -1 });
    res.json({ users });
  } catch (error) {
    console.error("Users fetch error:", error);
    res.status(500).json({ 
      error: "Failed to fetch users" 
    });
  }
});

export default router;
