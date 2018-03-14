'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _users = require('./users');

var _users2 = _interopRequireDefault(_users);

var _civilizations = require('./civilizations');

var _civilizations2 = _interopRequireDefault(_civilizations);

var _scores = require('./scores');

var _scores2 = _interopRequireDefault(_scores);

var _auth = require('./auth');

var _auth2 = _interopRequireDefault(_auth);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var jwt = require('jsonwebtoken');

exports.default = function (app, connection) {
  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Authorization, Origin, X-Requested-With, Content-Type, Accept");
    next();
  });
  (0, _auth2.default)(app, connection);
  /*app.use((req, res, next) => {
    var token = req.body.token || req.query.token || req.headers['token'];
    // decode token
    if (token) {
      jwt.verify(token, app.get('superSecret'), function(err, decoded) {
        if (err) {
          return res.json({ success: false, message: 'Failed to authenticate token.' });
        } else {
          req.decoded = decoded;
          next();
        }
      });
    } else {
      return res.status(403).send({
          success: false,
          message: 'No token provided.'
      });
    }
  })*/
  (0, _users2.default)(app, connection);
  (0, _civilizations2.default)(app, connection);
  (0, _scores2.default)(app, connection);
};