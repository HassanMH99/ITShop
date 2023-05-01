const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please Enter Your name"],
    maxLength: [20, "Your name Cannot exceed 20 charcter"],
  },
  email: {
    type: String,
    required: [true, "Please Enter Your email"],
    unique: true,
    validate: [validator.isEmail, "Please Enter The Valid Email"],
  },
  password: {
    type: String,
    required: [true, "Please Enter Your password"],
    minlength: [6, "Your Password must be more than 6 charecter"],
    select: false,
  },
  avatar: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  role: {
    type: String,
    default: "user",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  resetPasswordToken: String,
  resetPassowrdExpire: Date
});

//encrypt  password
userSchema.pre('save',async function(next){
    if(!this.isModified('password')){
        next()
    }
    this.password = await bcrypt.hash(this.password,10)
})

//compare password
userSchema.methods.comparePassword = async function (enteredPassword){
    return await bcrypt.compare(enteredPassword,this.password)
}

//Jwt token
userSchema.methods.getJwtToken = function(){
return jwt.sign({id:this._id},process.env.JWT_SECRET,{
    expiresIn:process.env.JWT_EXPIRES_TIME
})
}

//Password Reset
userSchema.methods.getResetPasswordToken = function(){
  //Generate Token
  const resetToken = crypto.randomBytes(20).toString('hex');
  //hashing
  this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex')
  //token expire time
  this.resetPasswordExpire = Date.now() +30*60*1000;
  return resetToken

}
module.exports = mongoose.model("User", userSchema);
