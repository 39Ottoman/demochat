var express = require('express');
var passport = require('passport');
var User = require('../models/user');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', {
    user: req.user
  });
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
  res.render('login', {
    user: req.user
  });
});

router.post('/login', passport.authenticate('local'), function (req, res) {
  console.log('user: ', req.user.username);
  res.redirect('/');
});

router.get('/logout', function (req, res) {
  req.logout();
  res.redirect('/');
});

router.get('/ping', function (req, res) {
  res.status(200).send("pong!");
});

module.exports = router;