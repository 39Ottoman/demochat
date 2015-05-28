var express = require('express');
var passport = require('passport');
var User = require('../models/user');
var Room = require('../models/room');
var router = express.Router();

/* GET home page. */
router.get('/', ensureAuthenticated, function (req, res, next) {
  res.redirect('/rooms');
});

router.get('/register', function (req, res) {
  if (req.user) {
    res.redirect('/rooms');
  }
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

// ログイン画面に遷移
router.get('/login', function (req, res) {
  if (req.user) {
    res.redirect('/rooms');
  }
  res.render('login', { user: req.user, info: req.flash('error') });
});

// ログイン後、チャットルーム一覧画面に遷移
router.post('/login', passport.authenticate('local', { failureRedirect: '/', failureFlash: true }), function (req, res) {
  res.redirect('/rooms');
});

// ログアウト後、ログイン画面に遷移
router.get('/logout', function (req, res) {
  req.logout();
  res.redirect('/login');
});

// チャットルーム一覧画面に遷移
router.get('/rooms', ensureAuthenticated, function (req, res) {
  res.render('rooms', { user: req.user });
});


// 全てのチャットルームを取得
router.get('/roomList', function (req, res) {
  Room.find({}, function(err, roomlist) {
    res.send(roomlist);
  });
});

// 新しいチャットルームを作成後、/roomsに遷移
router.post('/room', function(req, res) {
  var roomName = req.body.roomName;
  if (roomName) {
    var room = new Room();
    room.name = roomName;
    room.save();
  }
  res.redirect('/rooms');
});

// roomIdが該当するチャットルームの情報を取得する
router.get('/room/:roomId', function(req, res) {
  var roomId = req.params.roomId;
  Room.findOne({ _id: roomId }, function(err, room) {
    res.send(room);
  });
});

// roomIdが該当するチャットルームのチャットルーム内部画面に遷移する
router.get('/roompage/:roomId', ensureAuthenticated, function(req, res) {
  var roomId = req.params.roomId;
  Room.findOne({ _id: roomId }, function(err, room) {
    res.render('roompage', { user: req.user, room: room });
  });
});

// roomIdが該当するチャットルームに参加する
router.put('/room/:roomId/entry', function(req, res) {
  var roomId = req.params.roomId;
  var username = req.body.username;
  Room.findOne({ _id: roomId }, function(err, room) {
    // membersにusernameがなければ、追加
    var members = room.members;
    var index = members.indexOf(username);
    if(index === -1) {
      members.push(username);
      Room.update({ _id: roomId }, { $set: { members: members }}, function(err) {
        res.send(true);
      });
    }
    // } else {
    //   // あれば削除
    //   members.splice(i, 1);
    //   Room.update({ _id: roomId }, { $set: { members: members }}, function(err) {
    //     res.send(true);
    //   });
    // }
  });
});

// roomIdが該当するチャットルームから退出する
router.put('/room/:roomId/exit', function(req, res) {
  var roomId = req.params.roomId;
  var username = req.body.username;
  Room.findOne({ _id: roomId }, function(err, room) {
    // membersにusernameがなければ、追加
    var members = room.members;
    var index = members.indexOf(username);
    if(index != -1) {
      // あれば削除
      members.splice(index, 1);
      Room.update({ _id: roomId }, { $set: { members: members }}, function(err) {
        res.send(true);
      });
    }
  });
});


function ensureAuthenticated(req, res, next) {
  if(req.isAuthenticated()) { return next(); }
  res.redirect('/login');
}

module.exports = router;
