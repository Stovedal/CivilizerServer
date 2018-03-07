import uuidv4 from 'uuid/v4'
const bcrypt = require('bcrypt-nodejs')

module.exports = (app, connection ) => {

  //Get all users
  app.get('/users', (req,res) => {
    connection.query(
      "SELECT name, id, imgUrl FROM users",
      (err, rows, fields) => {
        if(err){
          res.send('FAILURE')
        } else {
          res.json(rows);
        }
      }
    )
  })

  //Add new user
  app.post('/users', (req,res) => {
    let userid = uuidv4()
    let passwordHash = bcrypt.hashSync(req.body.password)
    connection.query(
      "INSERT INTO users (id, name, password, imgUrl) VALUES (?,?,?,?)",
      [userid, req.body.name, passwordHash, req.body.imgUrl],
      (err, rows, fields) => {
        if(err){
          res.send('FAILURE')
        } else {
          let user = {
            id: userid,
            name: req.body.name,
          }
          res.json({
            user,
            status: 'SUCCESS',
          });
        }
      }
    )
  })

}
