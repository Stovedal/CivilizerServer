import users from './users'
import civilizations from './civilizations'
import scores from './scores'
import auth from './auth'
const jwt    = require('jsonwebtoken');


export default ( app, connection ) => {
  app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });
  auth(app, connection)
  /*app.use((req, res, next) => {
    var token = req.body.token || req.query.token || req.headers['x-access-token'];
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
  users( app, connection )
  civilizations( app, connection )
  scores( app, connection )

}
