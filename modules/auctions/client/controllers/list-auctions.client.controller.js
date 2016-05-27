(function () {
  'use strict';

  angular
    .module('auctions')
    .controller('AuctionsListController', AuctionsListController);

  AuctionsListController.$inject = ['AuctionsService', 'CategoriesService', 'FilterService', '$scope'];

  function AuctionsListController(AuctionsService, CategoriesService, FilterService, $scope) {
    var vm = this;

    vm.auctions = AuctionsService.query();

    vm.categories = CategoriesService.query();

    vm.isDisplayFilter = false;

    vm.displayFilter = function () {
      vm.isDisplayFilter = true;
    };
    
    vm.filterByCategory = function () {
      if (vm.chosenCategory === 'All') {
        vm.auctions = AuctionsService.query();
      } else {
        vm.auctions = FilterService.query({
          category: vm.chosenCategory
        });
      }
    };
  }
})();
