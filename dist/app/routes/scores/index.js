'use strict';

var _v = require('uuid/v4');

var _v2 = _interopRequireDefault(_v);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = function (app, connection) {

  //Get all scores
  app.get('/scores', function (req, res) {
    if (req.query.userid) {
      connection.query("SELECT * FROM scores WHERE userid=?", [req.query.userid], function (err, rows, fields) {
        if (err) {
          res.json({ success: false });
        } else {
          res.json({
            success: true,
            scores: rows
          });
        }
      });
    } else if (req.query.gameid) {
      connection.query("SELECT * FROM scores WHERE gameid=?", [req.query.gameid], function (err, rows, fields) {
        if (err) {
          res.send('FAILURE');
        } else {
          res.json(rows);
        }
      });
    } else if (req.query.civid) {
      connection.query("SELECT * FROM scores WHERE civid=?", [req.query.civid], function (err, rows, fields) {
        if (err) {
          res.send('FAILURE');
        } else {
          res.json(rows);
        }
      });
    } else {
      connection.query("SELECT * FROM scores", function (err, rows, fields) {
        if (err) {
          res.send('FAILURE');
        } else {
          res.json(rows);
        }
      });
    }
  });

  app.get('/scores/high', function (req, res) {
    connection.query("SELECT users.id, scores.score FROM users INNER JOIN scores on users.id=scores.userid", function (err, rows, fields) {
      if (err) {
        res.json({ success: false, message: 'Database says no' + err });
      } else {
        var scores = rows;
        connection.query('SELECT id, name, imgUrl FROM users', function (err, rows, fields) {
          if (err) {
            res.json({ success: false, message: 'Database says no' + err });
          } else {
            var result = rows.map(function (user) {
              user.score = averageScore(scores.filter(function (row) {
                return row.id === user.id;
              }));
              return user;
            });
            result.sort(function (e1, e2) {
              return e1.score < e2.score;
            });
            res.json({
              success: true,
              scores: result
            });
          }
        });
      }
    });
  });

  app.get('/scores/games', function (req, res) {
    connection.query('SELECT * FROM scores ORDER BY gameid', function (err, rows, fields) {
      if (err) {
        res.json({
          success: false,
          error: err
        });
      }
      var scores = rows;
      connection.query('SELECT DISTINCT gameid FROM scores', function (err, rows, fields) {
        if (err) {
          res.json({
            success: false,
            error: err
          });
        } else {
          var games = sortIntoGames(scores, rows);
          res.json({
            success: true,
            games: games
          });
        }
      });
    });
  });

  app.post('/scores', function (req, res) {
    var score = req.body;

    if (score.civid !== '') {
      connection.query("INSERT INTO scores (gameid, userid, civid, score, timestamp) VALUES (?, ?, ?, ?, ?)", [score.gameid, score.userid, score.civid, score.score, score.timestamp], function (err, rows, fields) {
        if (err) {
          error = true;
          res.json({
            success: false,
            message: 'Database says NO'
          });
        } else {
          res.json({
            success: true,
            id: score.gameid
          });
        }
      });
    } else {
      res.json({ success: false, message: score });
    }
  });
};

var averageScore = function averageScore(scoreArray) {
  var score = 0;
  if (scoreArray.length !== 0) {
    scoreArray.forEach(function (gamescore) {
      score = gamescore.score + score;
    });
    return Math.round(score / scoreArray.length);
  } else {
    return 0;
  }
};

var sortIntoGames = function sortIntoGames(scoreArray, gameIds) {
  var games = gameIds.map(function (gameId) {
    var game = {};
    game.id = gameId.gameId;
    game.scores = scoreArray.filter(function (e) {
      return e.gameid === gameId.gameid;
    });
    game.scores.sort(function (a, b) {
      return a.score < b.score;
    });
    game.timestamp = game.scores[0].timestamp;
    return game;
  });
  games.sort(function (a, b) {
    return (0, _moment2.default)(a.timestamp).isBefore((0, _moment2.default)(b.timestamp));
  });
  return games;
};