const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const { protect, admin } = require('../middlewares/auth');

// normal user sends message
router.post('/', protect, async (req, res) => {
  const { text } = req.body;
  try {
    const msg = await Message.create({ from: req.user._id, name: req.user.name, email: req.user.email, text });
    res.json(msg);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// admin reads messages
router.get('/', protect, admin, async (req, res) => {
  try {
    const msgs = await Message.find().sort({ createdAt: -1 });
    res.json(msgs);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
