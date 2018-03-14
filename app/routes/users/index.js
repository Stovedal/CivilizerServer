import uuidv4 from 'uuid/v4'
const bcrypt = require('bcrypt-nodejs')

module.exports = (app, connection ) => {

  //Get all users
  app.get('/users', (req,res) => {
    connection.query(
      "SELECT name, id, imgUrl FROM users",
      (err, rows, fields) => {
        if(err){
          res.json({ success: false })
        } else {
          res.json({
            success: true,
            users: rows
          });
        }
      }
    )
  })

  //Get specific user
  app.get('/users/id', (req,res) => {
    connection.query(
      "SELECT name, id, imgUrl FROM users WHERE id=?",
      [req.query.id],
      (err, rows, fields) => {
        if(err){
          res.json({ success: false })
        } else {
          res.json({
            success: true,
            user: rows[0],
          });
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
          res.json({ success: false })
        } else {
          let user = {
            id: userid,
            name: req.body.name,
            imgUrl: req.body.imgUrl,
          }
          res.json({
            user,
            success: true,
          });
        }
      }
    )
  })

}
