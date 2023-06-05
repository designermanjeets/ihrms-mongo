const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const uploadSchema = new Schema({
  file: String,
  mimetype: String,
  path: String
}, {collection:'Upload'});

module.exports = mongoose.model('Upload', uploadSchema);
