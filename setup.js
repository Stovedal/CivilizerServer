const mysql = require('mysql')
const content = require('./DBObjects')
const config = require('./config')
const DBPort = config.DBPort
const AppPort = config.AppPort
const DBName = config.DBName
const bcrypt = require('bcrypt-nodejs')

console.log(DBPort, AppPort, DBName)

let connection = mysql.createConnection({
  connectionLimit: 50,
  host     : 'localhost',
  port     :  DBPort,
  user     : 'root',
  password : 'root',
})

connection.connect(function(err){
  if (err) {
    console.log(err)
  } else {
    console.log("Connected, creating Database: ", DBName)
  }

  connection.query("DROP DATABASE IF EXISTS " + DBName, function(error, rows, fields){
    console.log("Dropped last DB");
    createDB();
  })

})


const createDB = function(){

  connection.query("CREATE DATABASE " + DBName, function(error, rows, fields){
    if(error){
      console.log(error);
    } else {
      console.log("Created new DB");
      setupTables();
    }
  })
}

const setupTables = function(){
  connection = mysql.createConnection({
    connectionLimit: 50,
    host     : 'localhost',
    port     :  DBPort,
    user     : 'root',
    password : 'root',
    database : DBName,
  })

  //,  FOREIGN KEY(civid) REFERENCES civilizations(id))
  connection.query(
    "CREATE TABLE users( id varchar(255) NOT NULL, name varchar(255) NOT NULL, password varchar(255) NOT NULL, imgUrl varchar(255), PRIMARY KEY (id) )",
    function(error, rows, fields){
      if(error){
        console.log(error);
      } else {
        console.log("Setup users-table");
        content.users.map(function(user){
          var hash = bcrypt.hashSync(user.password);
          connection.query(
            "INSERT INTO users (id, name, password, imgUrl) VALUES (?,?,?,?)",
            [user.id, user.name, hash, user.imgUrl],
            function(err,rows,fields){
              if(err){
                console.log(err)
              } else {
                console.log("users populated with ", user.name)
              }
            }
          )
        })
      }
  })

  connection.query("CREATE TABLE civilizations( id varchar(255) NOT NULL, civilization varchar(255) NOT NULL, leader varchar(255), leaderImg varchar(255), iconImg varchar(255) , PRIMARY KEY (id) )", function(error, rows, fields){
    if(error){
      console.log(error);
    } else {
      console.log("Setup civilizations-table");
      content.civilizations.map(function(civ){
        connection.query(
          "INSERT INTO civilizations (id, civilization, leader, leaderImg, iconImg) VALUES (?,?,?,?,?)",
          [civ.id, civ.civilization, civ.leader, civ.leaderImg, civ.iconImg],
          function(err,rows,fields){
            console.log("civilizations populated with ", civ.civilization)

          }
        )
      })
    }
  })

}
