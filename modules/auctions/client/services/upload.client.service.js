/**
 * Created by rucar on 4/14/16.
 */
(function () {
  'use strict';

  angular
      .module('auctions')
      .factory('UploadService', UploadService);

  UploadService.$inject = ['$http','$q'];

  function UploadService($http, $q) {
    return {
      uploadFiles: function (files) {
        var url = '/api/utils/uploadFile';

        var deferred = $q.defer();

        var fd = new FormData();
        for (var i = 0; i< files.length; i++) {
          fd.append("files", files[i]);
        }
        
        $http.post(url, fd, {
          withCredentials: false,
          headers: {
            'Content-Type': undefined
          },
          transformRequest: angular.identity
        }).success(function (data) {
          console.log(data);
          deferred.resolve(data.filesNames);
        }).error(function (data) {
          console.log(data);
          deferred.reject(null);
        });

        return deferred.promise;
      }
    };
  }
})();
