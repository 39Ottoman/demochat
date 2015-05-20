var express = require('express');
var passport = require('passport');
var User = require('../models/user');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  if (req.user) {
    res.redirect('/rooms');
  } else {
    res.redirect('/login');
  }
});

router.get('/register', function (req, res) {
  res.render('register', {});
});

router.post('/register', function (req, res) {
  User.register(new User({
    username: req.body.username
  }), req.body.password, function (err, account) {
    if (err) {
      return res.render('register', {
        info: '既にそのユーザ名は使われています'
      });
    }

    passport.authenticate('local')(req, res, function () {
      res.redirect('/');
    });
  });
});

router.get('/login', function (req, res) {
  // console.log(req.flash('error'));
  res.render('login', { user: req.user, info: req.flash('error') });
});

router.post('/login', passport.authenticate('local', { failureRedirect: '/', failureFlash: true }), function (req, res) {
  res.redirect('/rooms');
});

router.get('/logout', function (req, res) {
  req.logout();
  res.redirect('/login');
});

router.get('/rooms', ensureAuthenticated, function (req, res) {
  res.render('rooms', { user: req.user });
});

function ensureAuthenticated(req, res, next) {
  if(req.isAuthenticated()) { return next(); }
  res.redirect('/login');
}

module.exports = router;
