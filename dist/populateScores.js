'use strict';

var mysql = require('mysql');
var content = require('./DBObjects');
var config = require('./config');
var DBPort = config.DBPort;
var AppPort = config.AppPort;
var DBName = config.DBName;

console.log(DBPort, AppPort, DBName);

var connection = mysql.createConnection({
  connectionLimit: 50,
  host: 'localhost',
  port: DBPort,
  user: 'root',
  password: 'root',
  database: DBName
});

connection.connect(function (err) {
  if (err) {
    console.log(err);
  } else {
    console.log("Connected, populating scores: ", DBName);
    content.scores.map(function (score) {
      connection.query("INSERT INTO scores (gameid, userid, civid, score, timestamp) VALUES (?, (SELECT id FROM users WHERE name=?), (SELECT id FROM civilizations WHERE civilization=?), ?, ?)", [score.gameid, score.user, score.civ, score.score, score.timestamp], function (error, rows, fields) {
        if (error) {
          console.log(error);
        } else {
          console.log("Inserted score");
        }
      });
    });
  }
});