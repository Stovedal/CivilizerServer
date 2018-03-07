import uuidv4 from 'uuid/v4'

module.exports = (app, connection ) => {

  //Get all scores
  app.get('/scores', (req,res) => {
    if(req.query.userid){
      connection.query(
        "SELECT * FROM scores WHERE userid=?",
        [req.query.userid],
        (err, rows, fields) => {
          if(err){
            res.json({ success: false })
          } else {
            res.json({
              success: true,
              scores: rows,
            });
          }
        }
      )
    } else if (req.query.gameid) {
      connection.query(
        "SELECT * FROM scores WHERE gameid=?",
        [req.query.gameid],
        (err, rows, fields) => {
          if(err){
            res.send('FAILURE')
          } else {
            res.json(rows);
          }
        }
      )
    } else if (req.query.civid) {
      connection.query(
        "SELECT * FROM scores WHERE civid=?",
        [req.query.civid],
        (err, rows, fields) => {
          if(err){
            res.send('FAILURE')
          } else {
            res.json(rows);
          }
        }
      )
    } else {
      connection.query(
        "SELECT * FROM scores",
        (err, rows, fields) => {
          if(err){
            res.send('FAILURE')
          } else {
            res.json(rows);
          }
        }
      )
    }
  })

  app.get('/scores/high', (req,res)=>{
    connection.query(
      "SELECT users.id, scores.score FROM users INNER JOIN scores on users.id=scores.userid",
      (err, rows, fields) => {
        if(err){
          res.json({success:false, message:'Database says no' + err})
        } else {
          let scores = rows;
          connection.query(
            'SELECT id, name, imgUrl FROM users',
            (err,rows,fields) => {
              if(err){
                res.json({success:false, message:'Database says no' + err})
              } else {
                let result = rows.map((user)=>{
                  user.score = averageScore(scores.filter(row=>row.id===user.id))
                  return user
                })
                result.sort((e1,e2)=>{
                  return e1.score < e2.score
                })
                res.json({
                  success: true,
                  scores: result,
                })
              }
            }
          )
        }
      }
    )
  })

}

const averageScore = (scoreArray) => {
  let score = 0;
  if(scoreArray.length!==0){
    scoreArray.forEach((gamescore)=>{
      score = gamescore.score + score
    })
    return Math.round(score/scoreArray.length)
  } else {
    return 0;
  }
}
