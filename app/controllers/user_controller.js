var User = require('../models/user')


// show signin
exports.showSignin =  function (req, res) {
  User.fetch(function (err, users) {
    res.render('signin', {
      title: '登录页面',
      users: users
    })
  })
}

// show signup
exports.showSignup =  function (req, res) {
  User.fetch(function (err, users) {
    res.render('signup', {
      title: '注册页面',
      users: users
    })
  })
}

//sign up
exports.signup = function(req,res){
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
    if(user&&user.length>0){
      res.redirect('/signup')
    }else{
      var user = new User(_user)
      user.save(function(err,user){
        if(err) console.log(err)
        console.log(user)
        res.redirect('/signin')
      })
    }
  })
}

//signin 
exports.signin = function(req,res){
  var _user = req.body.user
  var name = _user.name
  var password = _user.password
  User.findOne({name:name},function(err,user){
    if(err) console.log(err)
    if(!user){
      return res.redirect('/signin')
    }
    user.comparePassword(password,function(err,isMatch){
        if(err) console.log(err)
        if(isMatch){
          req.session.user = user
          return res.redirect('/')
        }else{
          return res.redirect('/signin')
        }
    })
  })
}


//logout 
exports.logout = function(req,res){
  delete req.session.user
  //TODO  delete app.locals.user
  res.redirect('/')
}

// list page
exports.list =  function (req, res) {
  User.fetch(function (err, users) {
    if (err) console.log(err)
    else res.render('userlist', {
      title: '用户列表',
      users: users
    })
  })
}

// midware for user
exports.signinRequire = function(req,res,next){
  var user = req.session.user
  if(!user) 
    return res.redirect('/signin')
  next()
}

exports.adminRequire = function(req,res,next){
  var user = req.session.user
  console.log(user)
  if(!user.role || user.role <= 10){
    return res.redirect('/signin')
  }
  next()
}