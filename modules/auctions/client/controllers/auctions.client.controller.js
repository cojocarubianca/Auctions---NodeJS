(function () {
  'use strict';

  // Auctions controller
  angular
    .module('auctions')
    .controller('AuctionsController', AuctionsController);

  AuctionsController.$inject = ['$scope', '$timeout', '$q', '$state', 'Authentication', 'auctionResolve',
    'CategoriesService', 'CurrenciesService', 'UploadService'];

  function AuctionsController ($scope, $timeout, $q, $state, Authentication, auction,
                               categoriesService, currenciesService, uploadService) {
    var vm = this;

    vm.authentication = Authentication;
    vm.auction = auction;
    vm.error = null;
    vm.messages = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    vm.startDatePopup = {
      opened : false
    };

    vm.openStartDatePopup = function () {
      vm.startDatePopup.opened = true;
    };

    vm.endDatePopup = {
      opened : false
    };

    vm.categories = categoriesService.query();
    vm.currencies = currenciesService.query();
    
    // ====== Upload =======

    vm.files = [];
    vm.srcFiles = [];

    vm.uploadFiles = function () {
      var err = uploadService.uploadFiles(vm.files,
          function(msg){
            vm.messages = 'Pictures uploaded';
          },
          function (msg) {
            vm.error = 'Could not upload';
          });
      if (err) {
        vm.error = 'Could not upload';
        return false;
      }
      vm.messages = 'Pictures uploaded';
    };

    $scope.uploadedFile = function(element) {
      $scope.$apply(function($scope) {
        var files = element.files;
        for (var i = 0; i< files.length; i++) {
          $scope.getSrcFromImage(files[i])
              .then(function (imgSrc) {
                files[i].imgSrc = imgSrc;
            });
          vm.files.push(files[i]);
        }
      });
    };

    $scope.getSrcFromImage = function (file) {
      var deferred = $q.defer();

      var reader = new FileReader();
      var imgSrc = '//:0';

      reader.onload = function (e) {
        imgSrc = e.target.result;
      };

      reader.readAsDataURL(file);
      deferred.resolve(imgSrc);
      return deferred.promise;
    };

    $scope.removeFile = function (file) {
      var index = vm.files.indexOf(file);
      if (index > -1) {
        vm.files.splice(index, 1);
      }
    };
    
    // ====== Upload =======
    
    

    // Remove existing Auction
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.auction.$remove($state.go('auctions.list'));
      }
    }

    // Save Auction
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.auctionForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.auction._id) {
        vm.auction.$update(successCallback, errorCallback);
      } else {
        vm.auction.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('auctions.view', {
          auctionId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
})();
