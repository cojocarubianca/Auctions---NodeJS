/**
 * Created by rucar on 4/12/16.
 */
(function () {
  'use strict';

  angular
      .module('auctions')
      .factory('CurrenciesService', CurrenciesService);

  CurrenciesService.$inject = ['$resource'];

  function CurrenciesService($resource) {
    return $resource('/api/currencies');
  }
})();
