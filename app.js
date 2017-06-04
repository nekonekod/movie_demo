/**
 * Created by Nekonekod on 2017/6/4.
 */
var express = require('express')
var path = require('path')
var bodyParser = require('body-parser')
var mongoose = require('mongoose')
var _ = require('underscore')
var moment = require('moment')
var Movie = require('./models/movie')
var port = process.env.PORT || 80
var app = express()

mongoose.connect('mongodb://localhost/movie_demo')

app.set('views', './views')
app.set('view engine', 'jade')
// use body-parser to grab infor from POST
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.locals.moment = moment

app.use(express.static(path.join(__dirname, "public")))
app.listen(port)

console.log('movie_demo start on port ' + port)

//router
// index page
app.get('/', function (req, res) {
  Movie.fetch(function (err, movies) {
    if (err) console.log(err)
    else res.render('pages/index', {
      title: '首页',
      movies: movies
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