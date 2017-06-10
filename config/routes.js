var IndexController = require('../app/controllers/index_controller')
var MovieController = require('../app/controllers/movie_controller')
var UserController = require('../app/controllers/user_controller')
var CommentController = require('../app/controllers/commment_controller')

module.exports = function(app){
  //pre handle user
  app.use(function(req,res,next){
    var _user = req.session.user
    if(_user) app.locals.user = _user
    else app.locals.user = null
    next()
  })

  //Index
  app.get('/', IndexController.index)

  //User
  app.post('/user/signup',UserController.signup)
  app.post('/user/signin',UserController.signin)
  app.get('/signin',UserController.showSignin)
  app.get('/signup',UserController.showSignup)
  app.get('/logout',UserController.logout)
  app.get('/admin/user/list',UserController.signinRequire,UserController.adminRequire, UserController.list)

  //Movie
  app.get('/movie/:id', MovieController.detail)
  app.get('/admin/movie/new',UserController.signinRequire,UserController.adminRequire, MovieController.new)
  app.get('/admin/movie/update/:id', UserController.signinRequire,UserController.adminRequire,MovieController.update)
  app.post('/admin/movie', UserController.signinRequire,UserController.adminRequire,MovieController.save)
  app.get('/admin/movie/list', UserController.signinRequire,UserController.adminRequire,MovieController.list)
  app.delete('/admin/movie/list',UserController.signinRequire,UserController.adminRequire,MovieController.del)

  //Comment
  app.post('/admin/comment',UserController.signinRequire,CommentController.save)
}