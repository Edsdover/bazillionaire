'use strict';

var async = require('async');

module.exports = function(app) {
  // data sources
  var mysqlDs = app.dataSources.mysqlDs;

  // create base models
  async.parallel({
    accessTokens: async.apply(createAccessTokens),
    users: async.apply(createUsers),
    userCredentials: async.apply(createUserCredentials),
    userIdentities: async.apply(createUserIdentities),
  }, (err, results) => {
    if (err) throw err;
    console.log('> Base models created sucessfully.');
  });

  // migrate and seed model fixtures
  async.waterfall([
    createPlayers,
    createGames,
    createCompanies,
    createShips,
  ], (err, results) => {
    if (err) throw err;
    console.log('> Model fixtures migrated and seeded successfully.');
  });

  // create access tokens
  function createAccessTokens(callback) {
    mysqlDs.isActual('AccessToken', (err, actual) => {
      if (err) return callback(err);
      if (!actual) {
        mysqlDs.automigrate('AccessToken', callback);
      } else {
        callback(null, actual);
      }
    });
  }

  // create users
  function createUsers(callback) {
    mysqlDs.isActual('User', (err, actual) => {
      if (err) return callback(err);
      if (!actual) {
        mysqlDs.automigrate('User', callback);
      } else {
        callback(null, actual);
      }
    });
  }

  // create user credentials
  function createUserCredentials(callback) {
    mysqlDs.isActual('UserCredential', (err, actual) => {
      if (err) return callback(err);
      if (!actual) {
        mysqlDs.automigrate('UserCredential', callback);
      } else {
        callback(null, actual);
      }
    });
  }

  // create user identities
  function createUserIdentities(callback) {
    mysqlDs.isActual('UserIdentity', (err, actual) => {
      if (err) return callback(err);
      if (!actual) {
        mysqlDs.automigrate('UserIdentity', callback);
      } else {
        callback(null, actual);
      }
    });
  }

  // create players
  function createPlayers(callback) {
    mysqlDs.automigrate('Player', function(err) {
      if (err) return callback(err);

      var Player = app.models.Player;

      Player.create([{
        email: 'foo@bar.com',
        password: 'foobar',
      }, {
        email: 'john@doe.com',
        password: 'johndoe',
      }, {
        email: 'jane@doe.com',
        password: 'janedoe',
      }], callback);
    });
  }

  // create games
  function createGames(players, callback) {
    mysqlDs.automigrate('Game', function(err) {
      if (err) return callback(err);

      var Game = app.models.Game;
      var DAY_IN_MILLISECONDS = 1000 * 60 * 60 * 24;

      var games = [];

      Game.create([{
        name: 'First Save',
        created: Date.now() - (DAY_IN_MILLISECONDS * 4),
        lastUpdated: Date.now() - (DAY_IN_MILLISECONDS * 4),
        playerId: players[0].id,
      }, {
        name: 'Hoff Meister wins again!',
        created: Date.now() - (DAY_IN_MILLISECONDS * 3),
        lastUpdated: Date.now() - (DAY_IN_MILLISECONDS * 3),
        playerId: players[1].id,
      }, {
        name: 'Cargo full...',
        created: Date.now() - (DAY_IN_MILLISECONDS * 2),
        lastUpdated: Date.now() - (DAY_IN_MILLISECONDS * 2),
        playerId: players[1].id,
      }, {
        name: 'Crew happy.',
        created: Date.now() - DAY_IN_MILLISECONDS,
        lastUpdated: Date.now() - DAY_IN_MILLISECONDS,
        playerId: players[2].id,
      }], (err, games) => {
        callback(null, games, players);
      });

      // @TODO: Implement mature (or at least less hacky) database migrations.
      /*
      let sql = `
        ALTER TABLE Game
        add constraint fk_player
        foreign key (playerId)
        REFERENCES Player (id);
      `

      Game.dataSource.connector.execute(sql, () => {});
      */
    });
  }

  // create companies
  function createCompanies(games, players, callback) {
    mysqlDs.automigrate('Company', function(err) {
      if (err) return callback(err);

      var Company = app.models.Company;

      Company.create([{
        name: 'Dover Inc.',
        gameId: games[0].id,
        playerId: players[2].id,
      }, {
        name: 'Lou Corp',
        gameId: games[1].id,
      }, {
        name: 'Gizzy Shipping',
        gameId: games[1].id,
      }, {
        name: 'Trading Corp. IV',
        gameId: games[2].id,
      }, {
        name: 'Vandergriff Ltd.',
        gameId: games[3].id,
      }, {
        name: 'Puffer Inc.',
        gameId: games[3].id,
      }, {
        name: 'Roke Transport',
        gameId: games[3].id,
      }, {
        name: 'Hoff Meister',
        gameId: games[3].id,
      }], callback);
    });
  }

  // create ships
  function createShips(companies, callback) {
    mysqlDs.automigrate('Ship', function(err) {
      if (err) return callback(err);

      var Ship = app.models.Ship;

      Ship.create([{
        name: 'The Stinger XII',
        companyId: companies[0].id,
      }, {
        name: 'The Fly Catcher',
        companyId: companies[1].id,
      }, {
        name: 'Le Rock',
        companyId: companies[2].id,
      }, {
        name: 'Whaler 2000',
        companyId: companies[3].id,
      }, {
        name: 'Retina',
        companyId: companies[4].id,
      }, {
        name: 'Cerebralis',
        companyId: companies[5].id,
      }, {
        name: 'The Globulizer',
        companyId: companies[6].id,
      }, {
        name: 'Locomotis',
        companyId: companies[7].id,
      }], callback);
    });
  }
};
