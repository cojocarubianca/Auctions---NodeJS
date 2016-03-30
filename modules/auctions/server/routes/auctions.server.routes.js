'use strict';

/**
 * Module dependencies
 */
var auctionsPolicy = require('../policies/auctions.server.policy'),
  auctions = require('../controllers/auctions.server.controller');

module.exports = function(app) {
  // Auctions Routes
  app.route('/api/auctions').all(auctionsPolicy.isAllowed)
    .get(auctions.list)
    .post(auctions.create);

  app.route('/api/auctions/:auctionId').all(auctionsPolicy.isAllowed)
    .get(auctions.read)
    .put(auctions.update)
    .delete(auctions.delete);

  // Finish by binding the Auction middleware
  app.param('auctionId', auctions.auctionByID);
};
