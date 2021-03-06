var SALT_WORK_FACTOR = 10
var mongoose = require('mongoose')
var bcrypt = require('bcryptjs')

var UserSchema = new mongoose.Schema({
  name:{
    unique:true,
    type:String
  },
  password:{
    unique:false,
    type:String
  },
  //0:nomal user
  //1:verified user
  //2:professor user
  //>10:admin
  //>50 super admin
  role:Number,
  meta:{
    createAt:{
      type:Date,
      default:Date.now()
    },
    updateAt:{
      type:Date,
      default:Date.now()
    }

  }
})

UserSchema.pre('save',function (next) {
  var user = this
  if(this.isNew){
    this.meta.createAt = this.meta.updateAt = Date.now();
  } else{
    this.meta.updateAt = Date.now();
  }
  bcrypt.genSalt(SALT_WORK_FACTOR,function(err,salt){
    if(err) return next(err)
    bcrypt.hash(user.password,salt,function(err,hash){
      user.password = hash
      next()
    })
  })
})

// 实例方法
UserSchema.methods = {
  comparePassword:function(_password,cb){
    bcrypt.compare(_password,this.password,function(err,isMatch){
      if(err) return cb(err)
      cb(null,isMatch)
    })
  }
}

//静态方法
UserSchema.statics = {
  fetch: function(cb){
    return this.find({}).sort('meta.updateAt').exec(cb);
  },
  findById: function(id, cb){
    return this.findOne({_id: id}).exec(cb);

  }
}

module.exports = UserSchema