const express = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID || '',
  clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
  callbackURL: '/api/auth/google/callback',
}, async (accessToken, refreshToken, profile, done) => {
  try {
    let user = await User.findOne({ email: profile.emails[0].value });
    if (!user) {
      user = new User({
        username: profile.displayName,
        name: profile.displayName,
        email: profile.emails[0].value,
        profile: { avatar: profile.photos[0].value },
      });
      await user.save();
    }
    return done(null, user);
  } catch (err) {
    return done(err);
  }
}));

const router = express.Router();

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/login', session: false }), (req, res) => {
  // Send JWT or session info to frontend
  res.redirect(`/auth-success?token=${req.user._id}`); // Replace with JWT in production
});

module.exports = router;
