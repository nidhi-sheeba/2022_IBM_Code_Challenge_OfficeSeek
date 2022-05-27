const express = require('express');
const passport = require('passport');
const router = express.Router();
const User = require('../models/User');

const dotenv = require('dotenv');
dotenv.config();

//Signup routes
router.get('/signup', (req, res) => {
  res.render('user/signup');
});

router.post('/signup', (req, res) => {
  User.register(
    new User({
      email: req.body.email,
      type: req.body.type,
      pincode: req.body.pincode,
    }),
    req.body.password,
    (err, user) => {
      if (err) {
        console.log(err);
        res.redirect('/auth/signup');
      }
      passport.authenticate('local')(req, res, () => {
        res.render('user/otp');
      });
    }
  );
});

//Login routes
router.get('/login', (req, res) => {
  res.render('user/login');
});

router.post(
  '/login',
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/auth/login',
  }),
  (req, res) => {}
);

router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

module.exports = router;
