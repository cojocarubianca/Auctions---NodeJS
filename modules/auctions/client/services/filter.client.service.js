/**
 * Created by rucar on 5/27/16.
 */
(function () {
  'use strict';

  angular
      .module('auctions')
      .factory('FilterService', FilterService);

  FilterService.$inject = ['$resource'];

  function FilterService($resource) {
    return $resource('/api/auctions/categories/:category');
  }
})();
