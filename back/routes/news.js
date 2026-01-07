const express = require('express');
const router = express.Router();
const News = require('../models/News');
const { protect, admin } = require('../middlewares/auth');

// get all news (public)
// get all news (public)
// get liked news (protected)
router.get('/liked', protect, async (req, res) => {
  try {
    const news = await News.find({ likes: req.user._id }).sort({ publishedAt: -1 });
    res.json(news);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// get all news (public)
router.get('/', async (req, res) => {
  try {
    const { category } = req.query;
    let query = {};
    if (category && category !== 'All') {
      query.categories = { $in: [category] };
    }
    const news = await News.find(query).sort({ publishedAt: -1 });
    res.json(news);
  } catch (err) { res.status(500).json({ message: err.message }); }
});


// get one news (public)
router.get('/:id', async (req, res) => {
  try {
    const news = await News.findById(req.params.id);
    if (!news) return res.status(404).json({ message: 'News not found' });
    res.json(news);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// add news (admin)
router.post('/', protect, admin, async (req, res) => {
  const { title, script, youtubeLink, publishedAt, categories, isBreaking } = req.body;
  try {
    const n = await News.create({ title, script, youtubeLink, publishedAt, categories, isBreaking });
    res.json(n);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// update news (admin)
router.put('/:id', protect, admin, async (req, res) => {
  try {
    const n = await News.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(n);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// delete news (admin)
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    await News.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Like / Unlike news
router.put('/:id/like', protect, async (req, res) => {
  try {
    const news = await News.findById(req.params.id);
    if (!news) return res.status(404).json({ message: 'News not found' });

    // Check if already liked
    if (news.likes.includes(req.user._id)) {
      // Unlike
      news.likes = news.likes.filter(id => id.toString() !== req.user._id.toString());
    } else {
      // Like
      news.likes.push(req.user._id);
    }
    await news.save();
    res.json(news.likes);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Add comment
router.post('/:id/comment', protect, async (req, res) => {
  try {
    const news = await News.findById(req.params.id);
    if (!news) return res.status(404).json({ message: 'News not found' });

    const comment = {
      user: req.user._id,
      name: req.user.name,
      text: req.body.text
    };

    news.comments.push(comment);
    await news.save();
    res.json(news.comments);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
