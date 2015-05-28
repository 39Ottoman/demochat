var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Item = require('../models/item');


var Question = new Schema({
  username: String,
  title: String,
  items: [{
    type: Schema.Types.ObjectId,
    ref: 'Item'
  }],
  time: {
    type: Date,
    default: Date.now
  }
});


module.exports = mongoose.model('Question', Question);
