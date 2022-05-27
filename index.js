const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const dotenv = require('dotenv');
dotenv.config();
const auth = require('./routes/auth');
const application = require('./routes/application');
const User = require('./models/User');
const Application = require('./models/Application');
const checkAuthentication = require('./helpers/checkAuth');
(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
  } catch (err) {
    console.log('error: ' + err);
  }
})();

// app configuration
const app = express();
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(
  require('express-session')({
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

// passport configuration
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Routes
app.use('/auth', auth);
app.use('/application', application);
app.get('/', checkAuthentication, async (req, res) => {
  try {
    let applications;

    if (req.user.type === 'general') {
      applications = await Application.find({ owner: req.user._id });
      res.render('home', { applications });
    } else {
      applications = await Application.find({ pincode: req.user.pincode });
      res.render('official-dashboard', { applications });
    }
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
});

const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
