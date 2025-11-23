const express = require('express');
const router = express.Router();

// ✅ 1. Import the protection middleware
const protect = require('../middleware/auth.middleware');

// @desc    Fetch a random motivational quote
// @route   GET /api/external/quote

router.get('/quote', protect,async(req,res) => {
    try {
        const response = await fetch("https://zenquotes.io/api/random");
        const data = await response.json();
        res.json(data); // forward it to frontend
    }
    catch{
        res.json([{ q: "Push yourself, because no one else is going to do it for you." }]);
    }
})

module.exports = router;