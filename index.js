import bodyParser from 'body-parser'
import routes from './app/routes'
import mysql from 'mysql'
import express from 'express'
import cookieParser from 'cookie-parser'
import passport from 'passport'
import morgan from 'morgan'


import { DBPort, AppPort, DBName, secret } from './config'

console.log(DBPort, AppPort, DBName)

const app = express()
let connection = mysql.createConnection({
  connectionLimit: 50,
  host     : 'localhost',
  port     :  DBPort,
  user     : 'root',
  password : 'root',
  database : DBName,
})
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(morgan('dev'))
app.set('superSecret', secret)

connection.connect((err) => {
  if (err) {
    console.log(err)
  } else {
    console.log("Connected")
  }
})
routes( app, connection )

app.listen(AppPort)
