var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var Question = new Schema({
  username: String,
  title: String,
  items: [Item],
  time: Date
});


module.exports = mongoose.model('Question', Question);
