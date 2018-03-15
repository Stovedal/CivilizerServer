'use strict';

var _v = require('uuid/v4');

var _v2 = _interopRequireDefault(_v);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = function (app, connection) {

  //Get all scores
  app.get('/civilizations', function (req, res) {
    connection.query("SELECT * FROM civilizations", function (err, rows, fields) {
      if (err) {
        res.json({ success: false });
      } else {
        res.json({
          success: true,
          civilizations: rows
        });
      }
    });
  });

  app.get('/civilizations/id', function (req, res) {
    connection.query("SELECT * FROM civilizations WHERE id=?", [req.query.id], function (err, rows, fields) {
      if (err) {
        res.json({ success: false });
      } else {
        res.json({
          success: true,
          civilization: rows[0]
        });
      }
    });
  });
};