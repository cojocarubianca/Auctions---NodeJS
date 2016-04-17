/**
 * Created by rucar on 4/13/16.
 */
'use strict';

var multer = require('multer'),
  path = require('path'),
  config = require(path.resolve('./config/config'));


exports.uploadFile = function (req, res) {
  var upload = multer(config.uploads.auctionImageUpload).single('file');
  upload(req,res,function(err){
    if(err){
      res.json({ error_code:1,err_desc:err });
      return;
    }
    res.json({ error_code:0,err_desc:null });
  });
};
