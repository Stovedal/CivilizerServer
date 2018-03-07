'use strict';

var _v = require('uuid/v4');

var _v2 = _interopRequireDefault(_v);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var bcrypt = require('bcrypt-nodejs');
var jwt = require('jsonwebtoken');

module.exports = function (app, connection) {

  app.post('/auth/login', function (req, res) {
    connection.query("SELECT * FROM users WHERE name=?", [req.body.name], function (err, rows, fields) {
      if (err) {
        res.send({ success: false, message: 'Database says no' });
      } else if (rows[0] === undefined) {
        res.json({ success: false, message: 'No such user' });
      } else {
        console.log(rows);
        if (bcrypt.compareSync(req.body.password, rows[0].password)) {
          var token = jwt.sign({ name: rows[0].name, id: rows[0].id }, app.get('superSecret'), { expiresIn: '1 days' });
          // return the information including token as JSON
          res.json({
            success: true,
            message: 'Successful login!',
            token: token
          });
        } else {
          res.json({ success: false, message: 'Wrong password' });
        }
      }
    });
  });

  app.get('/auth/test', function (req, res) {
    jwt.verify(req.query.token, app.get('superSecret'), function (err, decoded) {
      if (decoded) {
        res.json({ success: true, name: decoded.name, id: decoded.id });
      } else {
        res.json({ success: false, error: err });
      }
    });
  });
};