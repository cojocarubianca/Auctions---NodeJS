(function () {
  'use strict';

  angular
    .module('auctions')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', {
      title: 'Auctions',
      state: 'auctions',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'auctions', {
      title: 'List Auctions',
      state: 'auctions.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'auctions', {
      title: 'Create Auction',
      state: 'auctions.create',
      roles: ['user']
    });
  }
})();
