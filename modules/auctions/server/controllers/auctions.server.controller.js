'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Auction = mongoose.model('Auction'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Auction
 */
exports.create = function(req, res) {
  var auction = new Auction(req.body);
  auction.author = req.user;

  auction.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(auction);
    }
  });
};

/**
 * Show the current Auction
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var auction = req.auction ? req.auction.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  auction.isCurrentUserOwner = req.user && auction.user && auction.user._id.toString() === req.user._id.toString() ? true : false;

  res.jsonp(auction);
};

/**
 * Update a Auction
 */
exports.update = function(req, res) {
  var auction = req.auction ;

  auction = _.extend(auction , req.body);

  auction.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(auction);
    }
  });
};

/**
 * Delete an Auction
 */
exports.delete = function(req, res) {
  var auction = req.auction ;

  auction.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(auction);
    }
  });
};

/**
 * List of Auctions
 */
exports.list = function(req, res) { 
  Auction.find().sort('-created').populate('user', 'displayName').exec(function(err, auctions) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(auctions);
    }
  });
};

/**
 * Auction middleware
 */
exports.auctionByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Auction is invalid'
    });
  }

  Auction.findById(id).populate('user', 'displayName').exec(function (err, auction) {
    if (err) {
      return next(err);
    } else if (!auction) {
      return res.status(404).send({
        message: 'No Auction with that identifier has been found'
      });
    }
    req.auction = auction;
    next();
  });
};

exports.allCategories = function (req, res) {
  var categories = Auction.schema.path('category').enumValues;
  res.jsonp(categories);
};

exports.allCurrencies = function (req, res) {
  var currencies = Auction.schema.path('currency').enumValues;
  res.jsonp(currencies);
};
