import express from 'express';
// import { verifyToken } from './middleware/authMiddleware.js';

const router = express.Router();

// This route is public - anyone can see posts
router.get('/posts', (req, res) => {
 res.send("Public blog posts");
});

// This route is protected - only users with a valid token can create a post
// The verifyToken function runs FIRST. If it calls next(), the second function runs.
router.post('/posts', verifyToken, (req, res) => {
 // Because of our middleware, we now have access to req.user.id
 res.send(`Post created by user: ${req.user.id}`);
});

export default router;