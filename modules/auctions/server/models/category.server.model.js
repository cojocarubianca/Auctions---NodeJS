/**
 * Created by rucar on 3/30/16.
 */

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var CategorySchema = new Schema({
  name: {
    type: String,
    required: 'Category name is required'
  }
});

mongoose.model('Category', CategorySchema); 

