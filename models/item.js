var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var Item = new Schema({
  text: String,
  selected: [String] // userIdの集合
});


module.exports = mongoose.model('Item', Item);
