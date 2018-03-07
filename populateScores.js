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
    connection.query("CREATE TABLE scores( gameid varchar(255) NOT NULL, userid varchar(255) NOT NULL, civid varchar(255) NOT NULL, score int NOT NULL , timestamp varchar(255) NOT NULL, FOREIGN KEY (userid) REFERENCES users(id) ON DELETE CASCADE, FOREIGN KEY (civid) REFERENCES civilizations(id) ON DELETE CASCADE)", function(error, rows, fields){
      if(error){
        console.log(error);
      } else {
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
    console.log("Connected, populating scores: ", DBName)

  }
})
