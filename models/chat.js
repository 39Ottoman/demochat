var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var Chat = new Schema({
  text: String,
  username: String,
  time: Date
});


module.exports = mongoose.model('Chat', Chat);
