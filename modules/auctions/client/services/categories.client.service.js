/**
 * Created by rucar on 4/10/16.
 */
(function () {
  'use strict';

  angular
      .module('auctions')
      .factory('CategoriesService', CategoriesService);

  CategoriesService.$inject = ['$resource'];

  function CategoriesService($resource) {
    return $resource('/api/categories');
  }
})();
