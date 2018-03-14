import uuidv4 from 'uuid/v4'
import moment from 'moment'

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

  app.get('/scores/games', (req,res) => {
    connection.query(
      'SELECT * FROM scores ORDER BY gameid',
      (err, rows, fields) => {
        if(err){
          res.json({
            success: false,
            error: err
          })
        }
        let scores = rows
        connection.query(
          'SELECT DISTINCT gameid FROM scores',
          (err, rows, fields) => {
            if(err){
              res.json({
                success: false,
                error: err
              })
            } else {
              let games = sortIntoGames(scores, rows)
              res.json({
                success: true,
                games: games,
              })
            }
          }
        )

      }
    )
  })

  app.post('/scores', (req, res) => {
    let score = req.body
    connection.query(
      "INSERT INTO scores (gameid, userid, civid, score, timestamp) VALUES (?, ?, ?, ?, ?)",
      [score.gameid, score.userid, score.civid, score.score, score.timestamp],
      (err, rows, fields) => {
        if(err){
          error = true;
          res.json({
            success:false,
            message: 'Database says NO',
          })
        } else {
          res.json({
            success:true,
            id: score.gameid,
          })
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

const sortIntoGames = (scoreArray, gameIds) => {
  let games = gameIds.map((gameId)=>{
    let game = {}
    game.id = gameId.gameId
    game.scores = scoreArray.filter((e)=>{return e.gameid===gameId.gameid})
    game.scores.sort((a,b) => { return a.score < b.score })
    game.timestamp = game.scores[0].timestamp
    return game
  })
  games.sort((a,b)=> {return moment(a.timestamp).isBefore(moment(b.timestamp))})
  return games
}
