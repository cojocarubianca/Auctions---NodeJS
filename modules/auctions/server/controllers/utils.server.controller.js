/**
 * Created by rucar on 4/13/16.
 */
'use strict';

var multer = require('multer'),
  path = require('path'),
  config = require(path.resolve('./config/config'));


exports.uploadFile = function (req, res) {
  var upload = multer(config.uploads.auctionImageUpload).array('files');
  upload(req,res,function(err){
    if(err){
      res.json({ error_code:1,err_desc:err });
    } else {
      var filesNames = [];
      for (var i = 0; i < req.files.length; i++) {
        var fileName = config.uploads.auctionImageUpload.dest + req.files[i].filename;
        filesNames.push(fileName);
      }
      res.json({filesNames : filesNames});
    }
  });
};


