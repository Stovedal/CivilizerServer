import uuidv4 from 'uuid/v4'
const bcrypt = require('bcrypt-nodejs')
const jwt    = require('jsonwebtoken');

module.exports = (app, connection ) => {

  app.post('/auth/login', (req,res)=>{
    console.log(req.body)
    connection.query(
      "SELECT * FROM users WHERE name=?",
      [req.body.name],
      (err, rows, fields)=>{
        if(err){
          res.send({success: false, message: 'Database says no'})
        } else if(rows[0]===undefined){
          res.json({success: false, message: 'No such user'})
        } else {
          console.log(rows)
          if(bcrypt.compareSync(req.body.password, rows[0].password)){
            var token = jwt.sign({ name: rows[0].name, id: rows[0].id }, app.get('superSecret'), {expiresIn: '1 days'})
            // return the information including token as JSON
            res.json({
              success: true,
              message: 'Successful login!',
              token: token,
              name: rows[0].name,
              id: rows[0].id,
              imgUrl: rows[0].imgUrl,
            });
          } else {
            res.json({success: false, message: 'Wrong password'})
          }
        }
      }
    )
  })

  app.get('/auth/test',(req,res)=>{
    jwt.verify(req.query.token, app.get('superSecret'), (err, decoded)=>{
      if(decoded){
        res.json({success:true, name: decoded.name, id: decoded.id})
      } else {
        res.json({success: false, error:err})
      }
    })
  })

}
