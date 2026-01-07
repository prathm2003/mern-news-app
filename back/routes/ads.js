const express = require('express');
const router = express.Router();
const Ad = require('../models/Ad');
// Assuming we want to protect ad creation like news
const { protect, admin } = require('../middlewares/auth');

// get all ads (public)
router.get('/', async (req, res) => {
    try {
        // Return all ads or random ads. For now, just all.
        const ads = await Ad.find().sort({ createdAt: -1 });
        res.json(ads);
    } catch (err) { res.status(500).json({ message: err.message }); }
});

// add ad (admin)
router.post('/', protect, admin, async (req, res) => {
    const { title, content, imageUrl, link } = req.body;
    try {
        const ad = await Ad.create({ title, content, imageUrl, link });
        res.json(ad);
    } catch (err) { res.status(500).json({ message: err.message }); }
});

// delete ad (admin)
router.delete('/:id', protect, admin, async (req, res) => {
    try {
        await Ad.findByIdAndDelete(req.params.id);
        res.json({ message: 'Deleted' });
    } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
