'use strict';

var mongoose = require('bluebird').promisifyAll(require('mongoose'));
var Schema = mongoose.Schema;

var BookSchema = new Schema({
  title: String,
  owner: String,  //this is the username
  addedOn: Date,
  proposeTrade: { type: Schema.ObjectId, ref: 'Book' }
});

module.exports = mongoose.model('Book', BookSchema);
