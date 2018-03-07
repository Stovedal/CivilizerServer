import uuidv4 from 'uuid/v4'


module.exports = (app, connection ) => {

  //Get all scores
  app.get('/civilizations', (req,res) => {
    connection.query(
      "SELECT * FROM civilizations",
      (err, rows, fields) => {
        if(err){
          res.send('FAILURE')
        } else {
          res.json(rows);
        }
      }
    )
  })

}
