var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Question = require('../models/question');
var Chat = require('../models/chat');


var Room = new Schema({
  name: String,
  description: {
    type: String,
    default: ''
  },
  members: [String], // usernameの集合
  online: [String], // usernameの集合
  chats: [{ // ChatのObjectIdの集合
    type: Schema.Types.ObjectId,
    ref: 'Chat'
  }],
  questions: [{ // QuestionのObjectIdの集合
    type: Schema.Types.ObjectId,
    ref: 'Question'
  }]
});


module.exports = mongoose.model('Room', Room);
