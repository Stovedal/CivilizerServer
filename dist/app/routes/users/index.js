'use strict';

var _v = require('uuid/v4');

var _v2 = _interopRequireDefault(_v);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var bcrypt = require('bcrypt-nodejs');

module.exports = function (app, connection) {

  //Get all users
  app.get('/users', function (req, res) {
    connection.query("SELECT name, id, imgUrl FROM users", function (err, rows, fields) {
      if (err) {
        res.json({ success: false });
      } else {
        res.json({
          success: true,
          users: rows
        });
      }
    });
  });

  //Get specific user
  app.get('/users/id', function (req, res) {
    connection.query("SELECT name, id, imgUrl FROM users WHERE id=?", [req.query.id], function (err, rows, fields) {
      if (err) {
        res.json({ success: false });
      } else {
        res.json({
          success: true,
          user: rows[0]
        });
      }
    });
  });

  //Add new user
  app.post('/users', function (req, res) {
    var userid = (0, _v2.default)();
    var passwordHash = bcrypt.hashSync(req.body.password);
    connection.query("INSERT INTO users (id, name, password, imgUrl) VALUES (?,?,?,?)", [userid, req.body.name, passwordHash, req.body.imgUrl], function (err, rows, fields) {
      if (err) {
        res.json({ success: false });
      } else {
        var user = {
          id: userid,
          name: req.body.name,
          imgUrl: req.body.imgUrl
        };
        res.json({
          user: user,
          success: true
        });
      }
    });
  });
};