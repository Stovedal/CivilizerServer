'use strict';

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _routes = require('./app/routes');

var _routes2 = _interopRequireDefault(_routes);

var _mysql = require('mysql');

var _mysql2 = _interopRequireDefault(_mysql);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _cookieParser = require('cookie-parser');

var _cookieParser2 = _interopRequireDefault(_cookieParser);

var _passport = require('passport');

var _passport2 = _interopRequireDefault(_passport);

var _morgan = require('morgan');

var _morgan2 = _interopRequireDefault(_morgan);

var _config = require('./config');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

console.log(_config.DBPort, _config.AppPort, _config.DBName);

var app = (0, _express2.default)();
var connection = _mysql2.default.createConnection({
  connectionLimit: 50,
  host: 'localhost',
  port: _config.DBPort,
  user: 'root',
  password: 'root',
  database: _config.DBName
});
app.use(_bodyParser2.default.urlencoded({ extended: true }));
app.use((0, _cookieParser2.default)());
app.use((0, _morgan2.default)('dev'));
app.set('superSecret', _config.secret);

connection.connect(function (err) {
  if (err) {
    console.log(err);
  } else {
    console.log("Connected");
  }
});
(0, _routes2.default)(app, connection);

app.listen(_config.AppPort);