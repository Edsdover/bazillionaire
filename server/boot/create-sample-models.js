var async = require('async');

module.exports = function(app) {
  // data sources
  var mysqlDs = app.dataSources.mysqlDs;

  // create and seed models
  async.parallel({
    players: async.apply(createPlayers),
  },
  function(err, results) {
    if (err) throw err;
    createGames(results.players, function(err) {
      console.log('> Models created and seeded successfully.');
    });
  });

  // create players
  function createPlayers(cb) {
    mysqlDs.automigrate('Player', function(err) {
      if (err) return cb(err);

      var Player = app.models.Player;

      Player.create([{
        email: 'foo@bar.com',
        password: 'foobar'
      }, {
        email: 'john@doe.com',
        password: 'johndoe'
      }, {
        email: 'jane@doe.com',
        password: 'janedoe'
      }], cb);
    });
  }

  // create games
  function createGames(players, cb) {
    mysqlDs.automigrate('Game', function(err) {
      if (err) return cb(err);

      var Game = app.models.Game;
      var DAY_IN_MILLISECONDS = 1000 * 60 * 60 * 24;

      Game.create([{
        name: "First Save",
        created: Date.now() - (DAY_IN_MILLISECONDS * 4),
        lastUpdated: Date.now() - (DAY_IN_MILLISECONDS * 4),
        playerId: players[0].id,
      }, {
        name: "Damn You Hoff Meister!",
        created: Date.now() - (DAY_IN_MILLISECONDS * 3),
        lastUpdated: Date.now() - (DAY_IN_MILLISECONDS * 3),
        playerId: players[1].id,
      }, {
        name: "Cargo full...",
        created: Date.now() - (DAY_IN_MILLISECONDS * 2),
        lastUpdated: Date.now() - (DAY_IN_MILLISECONDS * 2),
        playerId: players[1].id,
      }, {
        name: "Crew unhappy.",
        created: Date.now() - DAY_IN_MILLISECONDS,
        lastUpdated: Date.now() - DAY_IN_MILLISECONDS,
        playerId: players[2].id,
      }], cb);

      // @TODO: Hacky. Implement mature database migrations.
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
};
