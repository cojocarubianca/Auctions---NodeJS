'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'), Schema = mongoose.Schema;

/**
 * Auction Schema
 */
var AuctionSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Auction name',
    trim: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  author: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  startDate: {
    type: Date,
    required: 'Please fill starting date'
  },
  endDate: {
    type: Date,
    required: 'Please fill ending date'
  },
  startingBid: {
    type: Number,
    required: 'Please fill starting bid'
  },
  description: {
    type: String
  },
  highestBid: {
    type: Number
  },
  winner: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  currency: {
    type: String,
    enum: ['EUR', 'GBP', 'USD'],
    default: 'EUR',
    required: 'Please fill currency'
  },
  category: {
    type: String,
    enum: ['Art', 'Books', 'Antiques', 'Jewelry', 'Musical Instruments'],
    required: "Please fill the category"
  },
  status: {
    type: [{
      type: String,
      enum: ['active', 'inactive']
    }],
    default: ['inactive']
  },
  pictures: {
    type: [String],
    default: ['modules/auctions/client/img/defaultAuctionImage.png']
  }

});

mongoose.model('Auction', AuctionSchema);
