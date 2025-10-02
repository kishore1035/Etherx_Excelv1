const path = require('path');
const fs = require('fs');

// Save document to user's desktop
exports.saveToDesktop = (req, res) => {
  try {
    const { filename, content } = req.body;
    if (!filename || !content) {
      return res.status(400).json({ error: 'Filename and content required.' });
    }
    // Get desktop path for current user
    const desktopPath = path.join(require('os').homedir(), 'Desktop', filename);
    fs.writeFileSync(desktopPath, content, 'utf8');
    return res.json({ success: true, path: desktopPath });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
