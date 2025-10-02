


require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const passport = require('passport');
const authRoutes = require('./routes/auth');
const spreadsheetRoutes = require('./routes/spreadsheets');
const commentRoutes = require('./routes/comments');
const imageRoutes = require('./routes/images');

const app = express();
// Swagger API docs
require('./swagger')(app);
// Logging and error tracking
const morgan = require('morgan');
const winston = require('winston');
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({ format: winston.format.simple() }));
}
app.use(morgan('dev'));
app.use(cors());
app.use(express.json());
app.use(passport.initialize());
app.use('/api/auth', require('./routes/googleAuth'));

// OTP endpoints (retained)
let otpStore = {};

const twilio = require('twilio');
const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

app.post('/send-otp', async (req, res) => {
  const { phone } = req.body;
  if (!phone) {
    return res.status(400).json({ success: false, message: 'Phone required' });
  }
  try {
    await twilioClient.verify.v2.services(process.env.TWILIO_VERIFY_SERVICE_SID)
      .verifications.create({ to: phone, channel: 'sms' });
    res.json({ success: true, message: 'OTP sent via SMS' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.post('/verify-otp', (req, res) => {
  const { phone, email, otp } = req.body;
  if (!otp || (!phone && !email)) {
    return res.status(400).json({ success: false, message: 'Phone/email and OTP required' });
  }
  const key = phone || email;
  if (otpStore[key] === otp) {
    delete otpStore[key];
    res.json({ success: true, message: 'OTP verified!' });
  } else {
    res.status(400).json({ success: false, message: 'Invalid OTP' });
  }
});

app.use('/api/auth', authRoutes);
app.use('/api/spreadsheets', spreadsheetRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/images', imageRoutes);
app.use('/api/profile', require('./routes/profile'));
app.use('/api/sharing', require('./routes/sharing'));
app.use('/api/export-import', require('./routes/exportImport'));
app.use('/api/export-word-pdf', require('./routes/exportWordPdf'));
app.use('/api/templates', require('./routes/templates'));
app.use('/api/dashboard', require('./routes/dashboard'));
app.use('/api/edit-comment', require('./routes/editComment'));
app.use('/api/document', require('./routes/document'));
app.use('/api/ai', require('./routes/ai'));
// Serve uploaded images statically
const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/etherx-excel';

const http = require('http').createServer(app);
const { Server } = require('socket.io');
const io = new Server(http, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

const PORT = process.env.PORT || 5001;
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    http.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => console.error('MongoDB connection error:', err));

// Real-time collaboration events
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  socket.on('cursor-move', (data) => {
    socket.broadcast.emit('cursor-move', data);
  });
  socket.on('cell-edit', (data) => {
    socket.broadcast.emit('cell-edit', data);
  });
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// POST /verify-otp - verify the OTP entered by user
app.post('/verify-otp', async (req, res) => {
  const { phone, otp } = req.body;
  if (!phone || !otp) {
    return res.status(400).json({ success: false, message: 'Phone and OTP required' });
  }
  try {
    const verification = await twilioClient.verify.v2.services(process.env.TWILIO_VERIFY_SERVICE_SID)
      .verificationChecks.create({ to: phone, code: otp });
    if (verification.status === 'approved') {
      res.json({ success: true, message: 'OTP verified!' });
    } else {
      res.status(400).json({ success: false, message: 'Invalid OTP' });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});
// Advanced features
app.use('/api/advanced', require('./routes/advanced'));

