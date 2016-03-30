(function () {
  'use strict';

  describe('Auctions Route Tests', function () {
    // Initialize global variables
    var $scope,
      AuctionsService;

    //We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _AuctionsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      AuctionsService = _AuctionsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('auctions');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/auctions');
        });

        it('Should be abstract', function () {
          expect(mainstate.abstract).toBe(true);
        });

        it('Should have template', function () {
          expect(mainstate.template).toBe('<ui-view/>');
        });
      });

      describe('View Route', function () {
        var viewstate,
          AuctionsController,
          mockAuction;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('auctions.view');
          $templateCache.put('modules/auctions/client/views/view-auction.client.view.html', '');

          // create mock Auction
          mockAuction = new AuctionsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Auction Name'
          });

          //Initialize Controller
          AuctionsController = $controller('AuctionsController as vm', {
            $scope: $scope,
            auctionResolve: mockAuction
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:auctionId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.auctionResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            auctionId: 1
          })).toEqual('/auctions/1');
        }));

        it('should attach an Auction to the controller scope', function () {
          expect($scope.vm.auction._id).toBe(mockAuction._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/auctions/client/views/view-auction.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          AuctionsController,
          mockAuction;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('auctions.create');
          $templateCache.put('modules/auctions/client/views/form-auction.client.view.html', '');

          // create mock Auction
          mockAuction = new AuctionsService();

          //Initialize Controller
          AuctionsController = $controller('AuctionsController as vm', {
            $scope: $scope,
            auctionResolve: mockAuction
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.auctionResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/auctions/create');
        }));

        it('should attach an Auction to the controller scope', function () {
          expect($scope.vm.auction._id).toBe(mockAuction._id);
          expect($scope.vm.auction._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/auctions/client/views/form-auction.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          AuctionsController,
          mockAuction;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('auctions.edit');
          $templateCache.put('modules/auctions/client/views/form-auction.client.view.html', '');

          // create mock Auction
          mockAuction = new AuctionsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Auction Name'
          });

          //Initialize Controller
          AuctionsController = $controller('AuctionsController as vm', {
            $scope: $scope,
            auctionResolve: mockAuction
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:auctionId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.auctionResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            auctionId: 1
          })).toEqual('/auctions/1/edit');
        }));

        it('should attach an Auction to the controller scope', function () {
          expect($scope.vm.auction._id).toBe(mockAuction._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/auctions/client/views/form-auction.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
})();
