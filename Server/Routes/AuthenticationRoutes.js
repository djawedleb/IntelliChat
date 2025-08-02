import express from "express";
import passport from "passport";
import dotenv from "dotenv";
export const AuthRouter = express.Router();

//Local Authentication
AuthRouter.post("/login" , passport.authenticate('local') , (req,res)=>{
    res.json({
        message: 'Logged In!',
        user: {
            _id: req.user._id,
            name: req.user.name,
            email: req.user.email
        }
    });
});

AuthRouter.post("/logout" , (req, res) => {
    req.logout(() => {
    res.json({ message: 'Logged out!' });
    })}
);

AuthRouter.get('/auth', (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: 'Not authenticated' });
    };
    res.json({
        message: "authenticated!!",
        user: {
            _id: req.user._id,
            name: req.user.name,
            email: req.user.email
        }
    });
});

// Get current user profile
AuthRouter.get('/profile', (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: 'Not authenticated' });
    };
    res.json({
        user: {
            _id: req.user._id,
            name: req.user.name,
            email: req.user.email
        }
    });
});

//Google Authentication
AuthRouter.get('/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
);

AuthRouter.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/' }),
    (req, res) => {
        // Debug logging
        console.log('Google OAuth callback - User authenticated:', req.user);
        console.log('Session ID:', req.sessionID);
        console.log('Session data:', req.session);
        
        // Store user data in session and redirect
        res.redirect(`${process.env.FRONT_URL}/chat`);
    }
);

// Add error handling middleware for Google auth
AuthRouter.use('/auth/google/callback', (err, req, res, next) => {
  console.error('Google Auth Error:', err);
  res.status(500).json({ 
    error: 'Google authentication failed', 
    details: err.message 
  });
});

