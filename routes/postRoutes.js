const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth'); // Import our guard

// To create a post, you MUST pass through the protect middleware first
// If protect calls next(), then the (req, res) => { ... } logic runs.
router.post('/', protect, (req, res) => {
 res.json({ message: `Post created by user ${req.user}` });
});

module.exports = router;