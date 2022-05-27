const express = require('express');
const passport = require('passport');
const router = express.Router();
const Application = require('../models/Application');
const User = require('../models/User');
const checkAuthentication = require('../helpers/checkAuth');

const dotenv = require('dotenv');
dotenv.config();

router.get('/', checkAuthentication, (req, res) => {
  res.render('application');
});

router.post('/', checkAuthentication, async (req, res) => {
  try {
    await Application.create({
      ...req.body,
      owner: req.user._id,
      status: 'applied',
    });
    res.redirect('/');
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
});

router.post('/:status/:id', async (req, res) => {
  try {
    if (req.params.status === 'resolve') {
      await Application.findOneAndUpdate(
        { _id: req.params.id },
        { status: 'resolved' }
      );
    } else {
      await Application.findOneAndUpdate(
        { _id: req.params.id },
        { status: 'rejected' }
      );
    }

    res.redirect('/');
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
});

module.exports = router;
