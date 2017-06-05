/**
 * Created by Nekonekod on 2017/6/4.
 */
var express = require('express')
var path = require('path')
var bodyParser = require('body-parser')
var session = require('express-session')
var cookieParser = require('cookie-parser')
var mongoose = require('mongoose')
var mongoStore = require('connect-mongo')(session)
var _ = require('underscore')
var moment = require('moment')
var Movie = require('./models/movie')
var User = require('./models/user')
var port = process.env.PORT || 3000
var app = express()
var dbUrl = 'mongodb://localhost/movie_demo'
mongoose.connect(dbUrl)

app.set('views', './views')
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
app.listen(port)

console.log('movie_demo start on port ' + port)

//router
// index page
app.get('/', function (req, res) {
  Movie.fetch(function (err, movies) {
    if (err) console.log(err)
    else {
      console.log('user in session')
      console.log(req.session.user)
      res.render('pages/index', {
            title: '首页',
            movies: movies
          })
    }
  })
})

//sign up
app.post('/user/signup',function(req,res){
  // 1. 路由 /user/signup/:userid
  // var _userid = req.params.userid
  // 2. query /user/signup?userid=1111
  // var _userid = req.query.userid
  // 3. post-data ajax
  // var _user = req.body.userid
  // 或者req.param('userid')同时适用于1、2、3，优先级路由>body>query
  var _user = req.body.user
  //先查找是否存在同名的
  User.find({name:_user.name},function(err,user){
    if(err) console.log(err)
    if(user){
       res.redirect('/')
    }else{
      var user = new User(_user)
      user.save(function(err,user){
        if(err) console.log(err)
        console.log(user)
        res.redirect('/admin/user/list')
      })
    }
  })

})

//signin 
app.post('/user/signin',function(req,res){
  var _user = req.body.user
  var name = _user.name
  var password = _user.password
  User.findOne({name:name},function(err,user){
    if(err) console.log(err)
    if(!user){
      return res.redirect('/')
    }
    user.comparePassword(password,function(err,isMatch){
        if(err) console.log(err)
        if(isMatch){
          req.session.user = user
          return res.redirect('/')
        }else{
          console.log('Password is not matched')
        }
    })
  })
})

// list page
app.get('/admin/user/list', function (req, res) {
  User.fetch(function (err, users) {
    if (err) console.log(err)
    else res.render('pages/userlist', {
      title: '用户列表',
      users: users
    })
  })
})

// detail page
app.get('/movie/:id', function (req, res) {
  var id = req.params.id;
  Movie.findById(id, function (err, movie) {
    res.render('pages/detail', {
      title: movie.title,
      movie: movie
    })
  })
})

// admin page
app.get('/admin/movie', function (req, res) {
  res.render('pages/admin', {
    title: '录入',
    movie: {
      title: '',
      director: '',
      country: '',
      year: '',
      poster: '',
      flash: '',
      summary: '',
      language: ''
    }
  })
})

//admin update
app.get('/admin/update/:id', function (req, res) {
  var id = req.params.id
  if (id) {
    Movie.findById(id, function (err, movie) {
      res.render('pages/admin', {
        title: '更新',
        movie: movie
      })
    })
  }
})

// admin post movie
app.post('/admin/movie/new', function (req, res) {
  var id = req.body.movie._id
  var movieObj = req.body.movie
  var _movie
  if (id) {
    Movie.findById(id, function (err, movie) {
      if (err)
        console.log(err)
      _movie = _.extend(movie, movieObj)
      _movie.save(function (err, movie) {
        if (err) console.log(err)
        else res.redirect('/movie/' + movie._id)
      })
    })
  } else {
    _movie = new Movie({
      director: movieObj.director,
      title: movieObj.title,
      country: movieObj.country,
      year: movieObj.year,
      poster: movieObj.poster,
      flash: movieObj.flash,
      summary: movieObj.summary,
      language: movieObj.language
    })
    _movie.save(function (err, movie) {
      if (err) console.log(err)
      else res.redirect('/movie/' + movie._id)
    })
  }
})

// list page
app.get('/admin/list', function (req, res) {
  Movie.fetch(function (err, movies) {
    if (err) console.log(err)
    else res.render('pages/list', {
      title: '列表',
      movies: movies
    })
  })
})


app.delete('/admin/list',function (req, res) {
  var id = req.query.id
  if(id){
    Movie.remove({_id:id},function (err, movie) {
      if(err) console.log(err)
      else res.json({success:1})
    })
  }

})