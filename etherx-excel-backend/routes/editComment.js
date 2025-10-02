const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Comment = require('../models/Comment');

// Edit comment
router.put('/:id', auth, async (req, res) => {
  try {
    const { content } = req.body;
    const comment = await Comment.findOneAndUpdate(
      { _id: req.params.id, author: req.user.id },
      { content, edited: true, editedAt: Date.now() },
      { new: true }
    );
    if (!comment) return res.status(404).json({ error: 'Not found or not authorized' });
    res.json(comment);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
