var Movie = require('../models/movie')
var _ = require('underscore')


// detail page
exports.detail = function (req, res) {
var id = req.params.id;
Movie.findById(id, function (err, movie) {
  res.render('detail', {
    title: movie.title,
    movie: movie
  })
})
}

// admin page
exports.new = function (req, res) {
  res.render('admin', {
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
}

//admin update
exports.update = function (req, res) {
  var id = req.params.id
  if (id) {
    Movie.findById(id, function (err, movie) {
      res.render('admin', {
        title: '更新',
        movie: movie
      })
    })
  }
}

// admin post movie
exports.save = function (req, res) {
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
}

// list page
exports.list = function (req, res) {
  Movie.fetch(function (err, movies) {
    if (err) console.log(err)
    else res.render('list', {
      title: '列表',
      movies: movies
    })
  })
}

//delete
exports.del = function (req, res) {
  var id = req.query.id
  if(id){
    Movie.remove({_id:id},function (err, movie) {
      if(err) console.log(err)
      else res.json({success:1})
    })
  }
}