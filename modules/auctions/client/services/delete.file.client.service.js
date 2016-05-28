/**
 * Created by rucar on 5/27/16.
 */
(function () {
  'use strict';

  angular
      .module('auctions')
      .factory('RemoveFileService', RemoveFileService);

  RemoveFileService.$inject = ['$resource'];

  function RemoveFileService($resource) {
    return $resource('/api/utils/removeFile/:filePath');
  }
})();
