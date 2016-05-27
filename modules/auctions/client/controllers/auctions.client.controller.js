(function () {
  'use strict';

  // Auctions controller
  angular
    .module('auctions')
    .controller('AuctionsController', AuctionsController);

  AuctionsController.$inject = ['$scope', '$timeout', '$state', '$q', 'Authentication', 'auctionResolve',
    'CategoriesService', 'CurrenciesService', 'UploadService'];

  function AuctionsController ($scope, $timeout, $state, $q, Authentication, auction,
                               categoriesService, currenciesService, uploadService) {
    var vm = this;

    vm.authentication = Authentication;
    vm.auction = auction;
    vm.error = null;
    vm.messages = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;
    vm.bidValue = 0;

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

    vm.clock = {};
    
    // ====== Upload =======

    vm.files = [];
    vm.srcFiles = [];

    vm.uploadFiles = function () {
      var deferred = $q.defer();
      var promise = uploadService.uploadFiles(vm.files);

      promise.then(
          function (filesNames) {
            deferred.resolve(filesNames);
          },
          function (error) {
            deferred.reject(error);
          }
      );

      return deferred.promise;
    };

    $scope.uploadedFile = function(element) {
      $scope.$apply(function($scope) {
        var files = element.files;
        for (var i = 0; i< files.length; i++) {
          vm.files.push(files[i]);
          $scope.addSrcFromImage();
        }
      });
    };

    $scope.addSrcFromImage = function () {
      var reader = new FileReader();
      var file = vm.files[vm.files.length - 1];
      file.imgSrc = '//:0';

      reader.onload = function (e) {
        $timeout(function () {
          file.imgSrc = e.target.result;
        }, 0);
      };

      reader.readAsDataURL(file);
    };

    $scope.removeFile = function (file) {
      var index = vm.files.indexOf(file);
      if (index > -1) {
        vm.files.splice(index, 1);
      }
    };
    
    // ====== Upload =======
    
    $scope.bid = function () {
      if (vm.bidValue === 0) {
        vm.messages = 'The bid value cannot be 0';
        return false;
      }

      if (vm.bidValue < vm.auction.startingBid) {
        vm.messages = 'The bid has to be greater than the starting bid!'
        return false;
      }

      if (vm.bidValue <= vm.auction.highestBid) {
        vm.messages = 'The bid value has to be greater than the highest bid';
        return false;
      }

      var auxHighestBid = vm.auction.highestBid;
      var auxWinner = vm.auction.winner;

      vm.auction.highestBid = vm.bidValue;
      vm.auction.winner = vm.authentication.user;
      vm.auction.$update(
          function(res) {
            vm.messages = 'Your bid was successfully submited';
          },
          function(res) {
            vm.messages = 'Your bid cannot be processed at this moment. Please try again later.';
            vm.auction.highestBid = auxHighestBid;
            vm.auction.winner = auxWinner;
          });

      return false;
    };

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

      if (vm.files.length > 0) {
          var result = vm.uploadFiles();

          result.then(
              function (filesNames) {
                if (vm.auction.pictures === undefined) {
                  vm.auction.pictures = [];
                }
                vm.auction.pictures = vm.auction.pictures.concat(filesNames);

                if (vm.auction._id) {
                  vm.auction.$update(successCallback, errorCallback);
                } else {
                  vm.auction.$save(successCallback, errorCallback);
                }
              },
              function (error) {
                vm.messages = 'Error';
              }
          );
          return false;
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

    // === Countdown ====

    function getTimeRemaining(endTime) {
      var t = Date.parse(endTime) - Date.parse(new Date());
      var seconds = Math.floor((t / 1000) % 60);
      var minutes = Math.floor((t / 1000 / 60) % 60);
      var hours = Math.floor((t / (1000 * 60 * 60)) % 24);
      var days = Math.floor(t / (1000 * 60 * 60 * 24));
      return {
        'total': t,
        'days': days,
        'hours': hours,
        'minutes': minutes,
        'seconds': seconds
      };
    }

    function initializeClock(endTime) {
      vm.clock.ended = false;
      function updateClock() {
        $scope.$apply(function() {
          var t = getTimeRemaining(endTime);

          vm.clock.days = t.days;
          vm.clock.hours = ('0' + t.hours).slice(-2);
          vm.clock.minutes = ('0' + t.minutes).slice(-2);
          vm.clock.seconds = ('0' + t.seconds).slice(-2);

          if (t.total <= 0) {
            vm.clock.ended = true;
            clearInterval(clockInterval);
          }
        });
      }

      updateClock(endTime);
      var clockInterval = setInterval(updateClock, 1000);
    }

    initializeClock(vm.auction.endDate);
  }
})();
