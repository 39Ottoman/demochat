var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var Room = new Schema({
  name: String,
  description: String,
  members: [String], // usernameの集合
  online: [String], // usernameの集合
  chats: [String], // ChatのObjectIdの集合
  questions: [String] // QuestionのObjectIdの集合
});


module.exports = mongoose.model('Room', Room);
