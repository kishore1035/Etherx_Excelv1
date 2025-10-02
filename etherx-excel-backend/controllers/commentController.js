const Comment = require('../models/Comment');

exports.addComment = async (req, res) => {
  try {
    const { cellId, spreadsheetId, content, authorInitials } = req.body;
    const comment = new Comment({
      cellId,
      spreadsheet: spreadsheetId,
      author: req.user.id,
      authorInitials,
      content,
    });
    await comment.save();
    res.status(201).json(comment);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getComments = async (req, res) => {
  try {
    const { cellId, spreadsheetId } = req.query;
    const comments = await Comment.find({ cellId, spreadsheet: spreadsheetId }).populate('author', 'username');
    res.json(comments);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteComment = async (req, res) => {
  try {
    const { id } = req.params;
    const comment = await Comment.findOneAndDelete({ _id: id, author: req.user.id });
    if (!comment) return res.status(404).json({ error: 'Not found or not authorized' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
