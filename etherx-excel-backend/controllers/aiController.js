// This controller acts as an agent to solve user problems via the AI chatbot
const { saveToDesktop } = require('./documentController');

exports.solve = async (req, res) => {
  const { question, params } = req.body;
  // Example: route based on keywords in question
  try {
    const q = question.toLowerCase();
    // Formula calculation
    if (q.includes('formula') || q.includes('calculate')) {
      // Example: calculate a formula using params.formula and params.data
      try {
        const formula = params?.formula;
        const data = params?.data;
        // Simple formula parser (expand as needed)
        if (formula && data) {
          // For demo: support SUM, AVG, MIN, MAX
          let result;
          if (formula.toUpperCase().startsWith('SUM')) {
            result = data.reduce((a, b) => a + b, 0);
          } else if (formula.toUpperCase().startsWith('AVG')) {
            result = data.reduce((a, b) => a + b, 0) / data.length;
          } else if (formula.toUpperCase().startsWith('MIN')) {
            result = Math.min(...data);
          } else if (formula.toUpperCase().startsWith('MAX')) {
            result = Math.max(...data);
          } else {
            result = 'Unsupported formula';
          }
          return res.json({ formula, result });
        }
        return res.status(400).json({ error: 'Formula and data required.' });
      } catch (err) {
        return res.status(500).json({ error: err.message });
      }
    }

    // Chart generation
    if (q.includes('chart') || q.includes('graph')) {
      // Example: generate chart data from params.data
      try {
        const data = params?.data;
        if (data && Array.isArray(data)) {
          // For demo: return value counts for bar chart
          const valueCounts = {};
          data.forEach(val => {
            valueCounts[val] = (valueCounts[val] || 0) + 1;
          });
          return res.json({ chartType: 'bar', valueCounts });
        }
        return res.status(400).json({ error: 'Data required for chart.' });
      } catch (err) {
        return res.status(500).json({ error: err.message });
      }
    }
    // Save document to desktop
    if (q.includes('save') && q.includes('desktop')) {
      req.body.filename = params?.filename || 'AIChatbotDocument.txt';
      req.body.content = params?.content || question;
      return saveToDesktop(req, res);
    }

    // Spreadsheet analytics
    if (q.includes('analytics') || q.includes('stats')) {
      // Example: get user analytics
      req.url = '/api/advanced/analytics';
      req.method = 'GET';
      const advanced = require('../routes/advanced');
      return advanced.handle(req, res);
    }

    // Achievements
    if (q.includes('achievement') || q.includes('badge')) {
      req.url = '/api/advanced/achievements';
      req.method = 'GET';
      const advanced = require('../routes/advanced');
      return advanced.handle(req, res);
    }

    // Activity log
    if (q.includes('activity log') || q.includes('history')) {
      req.url = '/api/advanced/log';
      req.method = 'GET';
      const advanced = require('../routes/advanced');
      return advanced.handle(req, res);
    }

    // Advanced search
    if (q.includes('search') || q.includes('find')) {
      req.url = `/api/advanced/spreadsheet/search?q=${encodeURIComponent(params?.query || '')}`;
      req.method = 'GET';
      const advanced = require('../routes/advanced');
      return advanced.handle(req, res);
    }

    // Restore version
    if (q.includes('restore') && q.includes('version')) {
      req.url = `/api/advanced/spreadsheet/${params?.spreadsheetId}/restore-version`;
      req.method = 'POST';
      req.body = { versionIndex: params?.versionIndex };
      const advanced = require('../routes/advanced');
      return advanced.handle(req, res);
    }

    // Spreadsheet CRUD
    if (q.includes('create spreadsheet')) {
      req.url = '/api/spreadsheets';
      req.method = 'POST';
      req.body = { name: params?.name, data: params?.data };
      const spreadsheets = require('../routes/spreadsheets');
      return spreadsheets.handle(req, res);
    }
    if (q.includes('get spreadsheet')) {
      req.url = `/api/spreadsheets/${params?.id}`;
      req.method = 'GET';
      const spreadsheets = require('../routes/spreadsheets');
      return spreadsheets.handle(req, res);
    }
    if (q.includes('update spreadsheet')) {
      req.url = `/api/spreadsheets/${params?.id}`;
      req.method = 'PUT';
      req.body = { name: params?.name, data: params?.data };
      const spreadsheets = require('../routes/spreadsheets');
      return spreadsheets.handle(req, res);
    }
    if (q.includes('delete spreadsheet')) {
      req.url = `/api/spreadsheets/${params?.id}`;
      req.method = 'DELETE';
      const spreadsheets = require('../routes/spreadsheets');
      return spreadsheets.handle(req, res);
    }

    // Comments
    if (q.includes('add comment')) {
      req.url = '/api/comments';
      req.method = 'POST';
      req.body = { cellId: params?.cellId, spreadsheetId: params?.spreadsheetId, content: params?.content, authorInitials: params?.authorInitials };
      const comments = require('../routes/comments');
      return comments.handle(req, res);
    }
    if (q.includes('get comments')) {
      req.url = '/api/comments';
      req.method = 'GET';
      req.query = { cellId: params?.cellId, spreadsheetId: params?.spreadsheetId };
      const comments = require('../routes/comments');
      return comments.handle(req, res);
    }
    if (q.includes('delete comment')) {
      req.url = `/api/comments/${params?.id}`;
      req.method = 'DELETE';
      const comments = require('../routes/comments');
      return comments.handle(req, res);
    }

    // Default response
    return res.json({ answer: "I'm ready to solve your problem! Please specify your request (e.g., save document, run formula, get analytics, spreadsheet CRUD, advanced features)." });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
