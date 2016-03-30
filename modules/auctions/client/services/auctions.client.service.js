//Auctions service used to communicate Auctions REST endpoints
(function () {
  'use strict';

  angular
    .module('auctions')
    .factory('AuctionsService', AuctionsService);

  AuctionsService.$inject = ['$resource'];

  function AuctionsService($resource) {
    return $resource('api/auctions/:auctionId', {
      auctionId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();
