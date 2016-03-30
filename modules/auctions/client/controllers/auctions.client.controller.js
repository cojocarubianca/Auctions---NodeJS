(function () {
  'use strict';

  // Auctions controller
  angular
    .module('auctions')
    .controller('AuctionsController', AuctionsController);

  AuctionsController.$inject = ['$scope', '$state', 'Authentication', 'auctionResolve'];

  function AuctionsController ($scope, $state, Authentication, auction) {
    var vm = this;

    vm.authentication = Authentication;
    vm.auction = auction;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

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
