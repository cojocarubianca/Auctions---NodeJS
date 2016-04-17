'use strict';

/**
 * Module dependencies
 */
var auctionsPolicy = require('../policies/auctions.server.policy'),
  auctions = require('../controllers/auctions.server.controller'),
  utils = require('../controllers/utils.server.controller');

module.exports = function(app) {
  // Auctions Routes
  app.route('/api/auctions').all(auctionsPolicy.isAllowed)
    .get(auctions.list)
    .post(auctions.create);

  app.route('/api/auctions/:auctionId').all(auctionsPolicy.isAllowed)
    .get(auctions.read)
    .put(auctions.update)
    .delete(auctions.delete);

  app.route('/api/categories').all(auctionsPolicy.isAllowed)
      .get(auctions.allCategories);

  app.route('/api/currencies').all(auctionsPolicy.isAllowed)
      .get(auctions.allCurrencies);
  
  app.route('/api/utils/uploadFile').all(auctionsPolicy.isAllowed)
      .post(utils.uploadFile);

  // Finish by binding the Auction middleware
  app.param('auctionId', auctions.auctionByID);
};
