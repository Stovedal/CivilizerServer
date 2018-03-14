import uuidv4 from 'uuid/v4'


module.exports = (app, connection ) => {

  //Get all scores
  app.get('/civilizations', (req,res) => {
    connection.query(
      "SELECT * FROM civilizations",
      (err, rows, fields) => {
        if(err){
          res.json({ success: false })
        } else {
          res.json({
            success: true,
            civilizations: rows,
          });
        }
      }
    )
  })

  app.get('/civilizations/id', (req,res) => {
    connection.query(
      "SELECT * FROM civilizations WHERE id=?",
      [req.query.id],
      (err, rows, fields) => {
        if(err){
          res.json({ success: false })
        } else {
          res.json({
            success: true,
            civilization: rows[0],
          });
        }
      }
    )
  })
}
