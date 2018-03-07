const mysql = require('mysql')
const content = require('./DBObjects')
const config = require('./config')
const DBPort = config.DBPort
const AppPort = config.AppPort
const DBName = config.DBName

console.log(DBPort, AppPort, DBName)

let connection = mysql.createConnection({
  connectionLimit: 50,
  host     : 'localhost',
  port     :  DBPort,
  user     : 'root',
  password : 'root',
  database : DBName,
})

connection.connect(function(err){
  if (err) {
    console.log(err)
  } else {
    console.log("Connected, populating scores: ", DBName)
    content.scores.map(function(score){
      connection.query(
        "INSERT INTO scores (gameid, userid, civid, score, timestamp) VALUES (?, (SELECT id FROM users WHERE name=?), (SELECT id FROM civilizations WHERE civilization=?), ?, ?)",
        [ score.gameid, score.user, score.civ, score.score, score.timestamp ],
        function(error, rows, fields){
          if(error){
            console.log(error)
          } else {
            console.log("Inserted score");
          }
      })
    })
  }
})
