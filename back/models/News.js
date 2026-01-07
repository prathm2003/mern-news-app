const mongoose = require('mongoose');

const NewsSchema = new mongoose.Schema({
  title: { type: String, required: true },
  script: { type: String, required: true },
  youtubeLink: { type: String },
  categories: { type: [String], default: ['General'] },
  isBreaking: { type: Boolean, default: false },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  comments: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name: { type: String, required: true },
    text: { type: String, required: true },
    date: { type: Date, default: Date.now }
  }],
  publishedAt: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now, index: true }
});

// TTL index: removes documents 30 days (2592000 seconds) after createdAt
NewsSchema.index({ createdAt: 1 }, { expireAfterSeconds: 2592000 });

module.exports = mongoose.model('News', NewsSchema);
