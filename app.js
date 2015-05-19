var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');
var flash = require('connect-flash');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

// テスト用ユーザデータ(非DB)
var users = [
  {
    _id: '10JK220',
    userName: 'horikawa',
    password: 'chiharu'
  },
  {
    _id: '10JK256',
    userName: 'yamada',
    password: 'taro'
  }
];

function findById(id, func) {
  var index = id - 1;
  if (users[index]) {
    func(null, users[index]);
  } else {
    func(new Error('User ' + id + ' does not exist!'));
  }
}

function findByUsername(username, fn) {
  for (var i = 0, len = users.length; i < len; i++) {
    var user = users[i];
    if (user.username === username) {
      return fn(null, user);
    }
  }
  return fn(null, null);
}

passport.serializeUser(function (user, done) {
  done(null, user._id);
});

passport.deserializeUser(function (id, done) {
  findById(id, function (err, user) {
    done(err, user);
  });
});

// 非ログイン時の強制リダイレクト
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}

// passportの初期化
// persistent login sessions (recommended).
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(
  function (userName, password, done) {
    process.nextTick(function () {
      findByUsername(userName, function (err, user) {
        if (err) {
          return done(err);
        }
        if (!user) {
          return done(null, false, {
            message: 'Unknown user ' + userName
          });
        }
        if (user.password != password) {
          return done(null, false, {
            message: 'invalid password'
          });
        }
        return done(null, user);
      });
    });
  }
));


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

// 追加API
app.get('/login', function (req, res) {
  res.rendar('login', {
    user: req.user,
    message: req.flash('error')
  });
});

app.post('/login', function (req, res) {
  passport.authenticate('local', {
    failureRedirect: '/login',
    failureFlash: true
  }, function (req, res) {
    res.redirect('/login');
  });
});

app.get('/logout', function (req, res) {
  req.logout();
  res.redirect('/login');
});

app.get('/rooms', ensureAuthenticated, function (req, res) {
  res.rendar('rooms', {
    user: req.user
  });
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;