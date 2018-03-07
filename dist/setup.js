'use strict';

var mysql = require('mysql');
var content = require('./DBObjects');
var config = require('./config');
var DBPort = config.DBPort;
var AppPort = config.AppPort;
var DBName = config.DBName;
var bcrypt = require('bcrypt-nodejs');

console.log(DBPort, AppPort, DBName);

var connection = mysql.createConnection({
  connectionLimit: 50,
  host: 'localhost',
  port: DBPort,
  user: 'root',
  password: 'root'
});

connection.connect(function (err) {
  if (err) {
    console.log(err);
  } else {
    console.log("Connected, creating Database: ", DBName);
  }

  connection.query("DROP DATABASE IF EXISTS " + DBName, function (error, rows, fields) {
    console.log("Dropped last DB");
    createDB();
  });
});

var createDB = function createDB() {

  connection.query("CREATE DATABASE " + DBName, function (error, rows, fields) {
    if (error) {
      console.log(error);
    } else {
      console.log("Created new DB");
      setupTables();
    }
  });
};

var setupTables = function setupTables() {
  connection = mysql.createConnection({
    connectionLimit: 50,
    host: 'localhost',
    port: DBPort,
    user: 'root',
    password: 'root',
    database: DBName
  });
  connection.query("CREATE TABLE scores( gameid varchar(255), userid varchar(255), civid varchar(255), score int , timestamp varchar(255))", function (error, rows, fields) {
    if (error) {
      console.log(error);
    } else {
      console.log("Setup scores-table");
    }
  });

  connection.query("CREATE TABLE users( id varchar(255), name varchar(255), password varchar(255), imgUrl varchar(255) )", function (error, rows, fields) {
    if (error) {
      console.log(error);
    } else {
      console.log("Setup users-table");
      content.users.map(function (user) {
        var hash = bcrypt.hashSync(user.password);
        connection.query("INSERT INTO users (id, name, password, imgUrl) VALUES (?,?,?,?)", [user.id, user.name, hash, user.imgUrl], function (err, rows, fields) {
          if (err) {
            console.log(err);
          } else {
            console.log("users populated with ", user.name);
          }
        });
      });
    }
  });

  connection.query("CREATE TABLE civilizations( id varchar(255), civilization varchar(255), leader varchar(255) )", function (error, rows, fields) {
    if (error) {
      console.log(error);
    } else {
      console.log("Setup civilizations-table");
      content.civilizations.map(function (civ) {
        connection.query("INSERT INTO civilizations (id, civilization, leader) VALUES (?,?,?)", [civ.id, civ.civilization, civ.leader], function (err, rows, fields) {
          console.log("civilizations populated with ", civ.civilization);
        });
      });
    }
  });
};