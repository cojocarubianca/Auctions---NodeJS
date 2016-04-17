/**
 * Created by rucar on 4/14/16.
 */
(function () {
  'use strict';

  angular
      .module('auctions')
      .factory('UploadService', UploadService);

  UploadService.$inject = ['$http'];

  function UploadService($http) {
    return {
      uploadFiles: function (files, success, error) {
        var url = '/api/utils/uploadFile';

        var err = null;

        for (var i = 0; i < files.length; i++) {
          var fd = new FormData();
          fd.append("file", files[i]);
          $http.post(url, fd, {
            withCredentials: false,
            headers: {
              'Content-Type': undefined
            },
            transformRequest: angular.identity
          }).success(function (data) {
            console.log(data);
          }).error(function (data) {
            err = data;
            console.log(err);
            return err;
          });
        }
        return err;
      }
    };
  }
})();
