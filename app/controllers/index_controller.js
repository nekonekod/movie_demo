var Movie = require('../models/movie')
// index page
exports.index = function(req,res){
  Movie.fetch(function (err, movies) {
    if (err) console.log(err)
    else {
      console.log('user in session')
      console.log(req.session.user)
      res.render('index', {
            title: '首页',
            movies: movies
          })
    }
  })
}