/**
 * Created by rucar on 4/13/16.
 */
'use strict';

var multer = require('multer'),
  path = require('path'),
  config = require(path.resolve('./config/config')),
    fs = require('fs');


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

exports.removeFile = function (req, res, next, filePath) {
  fs.exists(filePath, function(exists) {
    if(exists) {
      console.log('File exists. Deleting now ...');
      fs.unlink(filePath);
    } else {
      console.log('File not found, so not deleting.');
    }
  });
};

