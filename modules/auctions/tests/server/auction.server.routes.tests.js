'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Auction = mongoose.model('Auction'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, auction;

/**
 * Auction routes tests
 */
describe('Auction CRUD tests', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new Auction
    user.save(function () {
      auction = {
        name: 'Auction name'
      };

      done();
    });
  });

  it('should be able to save a Auction if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Auction
        agent.post('/api/auctions')
          .send(auction)
          .expect(200)
          .end(function (auctionSaveErr, auctionSaveRes) {
            // Handle Auction save error
            if (auctionSaveErr) {
              return done(auctionSaveErr);
            }

            // Get a list of Auctions
            agent.get('/api/auctions')
              .end(function (auctionsGetErr, auctionsGetRes) {
                // Handle Auction save error
                if (auctionsGetErr) {
                  return done(auctionsGetErr);
                }

                // Get Auctions list
                var auctions = auctionsGetRes.body;

                // Set assertions
                (auctions[0].user._id).should.equal(userId);
                (auctions[0].name).should.match('Auction name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Auction if not logged in', function (done) {
    agent.post('/api/auctions')
      .send(auction)
      .expect(403)
      .end(function (auctionSaveErr, auctionSaveRes) {
        // Call the assertion callback
        done(auctionSaveErr);
      });
  });

  it('should not be able to save an Auction if no name is provided', function (done) {
    // Invalidate name field
    auction.name = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Auction
        agent.post('/api/auctions')
          .send(auction)
          .expect(400)
          .end(function (auctionSaveErr, auctionSaveRes) {
            // Set message assertion
            (auctionSaveRes.body.message).should.match('Please fill Auction name');

            // Handle Auction save error
            done(auctionSaveErr);
          });
      });
  });

  it('should be able to update an Auction if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Auction
        agent.post('/api/auctions')
          .send(auction)
          .expect(200)
          .end(function (auctionSaveErr, auctionSaveRes) {
            // Handle Auction save error
            if (auctionSaveErr) {
              return done(auctionSaveErr);
            }

            // Update Auction name
            auction.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Auction
            agent.put('/api/auctions/' + auctionSaveRes.body._id)
              .send(auction)
              .expect(200)
              .end(function (auctionUpdateErr, auctionUpdateRes) {
                // Handle Auction update error
                if (auctionUpdateErr) {
                  return done(auctionUpdateErr);
                }

                // Set assertions
                (auctionUpdateRes.body._id).should.equal(auctionSaveRes.body._id);
                (auctionUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Auctions if not signed in', function (done) {
    // Create new Auction model instance
    var auctionObj = new Auction(auction);

    // Save the auction
    auctionObj.save(function () {
      // Request Auctions
      request(app).get('/api/auctions')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Auction if not signed in', function (done) {
    // Create new Auction model instance
    var auctionObj = new Auction(auction);

    // Save the Auction
    auctionObj.save(function () {
      request(app).get('/api/auctions/' + auctionObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', auction.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Auction with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/auctions/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Auction is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Auction which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Auction
    request(app).get('/api/auctions/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Auction with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Auction if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Auction
        agent.post('/api/auctions')
          .send(auction)
          .expect(200)
          .end(function (auctionSaveErr, auctionSaveRes) {
            // Handle Auction save error
            if (auctionSaveErr) {
              return done(auctionSaveErr);
            }

            // Delete an existing Auction
            agent.delete('/api/auctions/' + auctionSaveRes.body._id)
              .send(auction)
              .expect(200)
              .end(function (auctionDeleteErr, auctionDeleteRes) {
                // Handle auction error error
                if (auctionDeleteErr) {
                  return done(auctionDeleteErr);
                }

                // Set assertions
                (auctionDeleteRes.body._id).should.equal(auctionSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Auction if not signed in', function (done) {
    // Set Auction user
    auction.user = user;

    // Create new Auction model instance
    var auctionObj = new Auction(auction);

    // Save the Auction
    auctionObj.save(function () {
      // Try deleting Auction
      request(app).delete('/api/auctions/' + auctionObj._id)
        .expect(403)
        .end(function (auctionDeleteErr, auctionDeleteRes) {
          // Set message assertion
          (auctionDeleteRes.body.message).should.match('User is not authorized');

          // Handle Auction error error
          done(auctionDeleteErr);
        });

    });
  });

  it('should be able to get a single Auction that has an orphaned user reference', function (done) {
    // Create orphan user creds
    var _creds = {
      username: 'orphan',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create orphan user
    var _orphan = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'orphan@test.com',
      username: _creds.username,
      password: _creds.password,
      provider: 'local'
    });

    _orphan.save(function (err, orphan) {
      // Handle save error
      if (err) {
        return done(err);
      }

      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var orphanId = orphan._id;

          // Save a new Auction
          agent.post('/api/auctions')
            .send(auction)
            .expect(200)
            .end(function (auctionSaveErr, auctionSaveRes) {
              // Handle Auction save error
              if (auctionSaveErr) {
                return done(auctionSaveErr);
              }

              // Set assertions on new Auction
              (auctionSaveRes.body.name).should.equal(auction.name);
              should.exist(auctionSaveRes.body.user);
              should.equal(auctionSaveRes.body.user._id, orphanId);

              // force the Auction to have an orphaned user reference
              orphan.remove(function () {
                // now signin with valid user
                agent.post('/api/auth/signin')
                  .send(credentials)
                  .expect(200)
                  .end(function (err, res) {
                    // Handle signin error
                    if (err) {
                      return done(err);
                    }

                    // Get the Auction
                    agent.get('/api/auctions/' + auctionSaveRes.body._id)
                      .expect(200)
                      .end(function (auctionInfoErr, auctionInfoRes) {
                        // Handle Auction error
                        if (auctionInfoErr) {
                          return done(auctionInfoErr);
                        }

                        // Set assertions
                        (auctionInfoRes.body._id).should.equal(auctionSaveRes.body._id);
                        (auctionInfoRes.body.name).should.equal(auction.name);
                        should.equal(auctionInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Auction.remove().exec(done);
    });
  });
});
