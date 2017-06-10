var express = require('express')
var path = require('path')
var bodyParser = require('body-parser')
var session = require('express-session')
var logger = require('morgan')
var cookieParser = require('cookie-parser')
var mongoose = require('mongoose')
var mongoStore = require('connect-mongo')(session)
var moment = require('moment')
var port = process.env.PORT || 3000
var app = express()
var dbUrl = 'mongodb://localhost/movie_demo'

mongoose.connect(dbUrl)

app.set('views', './app/views/pages')
app.set('view engine', 'jade')

// use body-parser to grab infor from POST
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.locals.moment = moment

app.use(express.static(path.join(__dirname, "public")))
app.use(cookieParser())
app.use(session({
  secret:'Movie',
  store:new mongoStore({
    url:dbUrl,
    collection:'sessions'
  }),
  resave: false,
  saveUninitialized: true
}))

if('development' === app.get('env')){
  app.set('showStackErr',true)
  app.use(logger(':method :url :status'))
  app.locals.pretty = true
  mongoose.set('debug',true)
}

require('./config/routes')(app)
app.listen(port)

console.log('movie_demo start on port ' + port)