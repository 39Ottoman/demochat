var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var User = new Schema({
  username: String,
  password: String
});

User.plugin(passportLocalMongoose, {
  incorrectPasswordError: '正しいパスワードを入力してください',
  incorrectUsernameError: '正しい%sを入力してください',
  missingUsernameError: '正しい%sを入力してください',
  missingPasswordError: 'パスワードが存在しません',
  usernameField: 'username'
});

module.exports = mongoose.model('User', User);
