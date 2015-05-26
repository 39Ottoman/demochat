var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var Item = new Schema({
  questionId: String,
  text: String,
  selected: [String] // userIdの集合
});


module.exports = mongoose.model('Item', Item);
