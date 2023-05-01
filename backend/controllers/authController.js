const User = require("../models/user");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const sendToken = require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");
const { send } = require("process");
//Register =>/api/vi/register

exports.Register = catchAsyncErrors(async (req, res, next) => {
  const { name, email, password } = req.body;
  const user = await User.create({
    name,
    email,
    password,
    avatar: {
      public_id: "11",
      url: "11",
    },
  });
  console.log("Login");
  sendToken(user, 200, res);
});
//login => api/v1/login
exports.Login = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;
  //check if email and password exist
  if (!email || !password) {
    return next(new ErrorHandler("Please enter email and password", 400));
  }

  //findng user in database
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new ErrorHandler("Invalid Email or Password", 400));
  }
  //check if true
  const isPasswordMatched = await user.comparePassword(password);
  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid Email or Password", 400));
  }
  sendToken(user, 200, res);
});
//forget passowrd => /api/v1/password/forget
exports.forgetPassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new ErrorHandler("User not found in this Email", 404));
  }
  //get reset token
  const resetToken =user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });

  const resetUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/password/reset/${resetToken}`;

  const massage = `Your Password Reset token is as foloow:\n\n${resetUrl}\n\nIf you have not requested this email,ignore`;
  try {
    await sendEmail({
      email: user.email,
      subject: "ITShop Password Recovery",
      massage,
    });
    res.status(200).json({
      success: true,
      massage: `Email sent to: ${user.email}`,
    });
  } catch (error) {
    user.resetPassowrdExpire = undefined;
    user.resetPasswordToken = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new ErrorHandler(error.massage, 500));
  }
});
//Reset passowrd => /api/v1/password/reset
exports.ResetPassword = catchAsyncErrors(async (req, res, next) => {
  // Hash URL token
  const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex')

  const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() }
  })

  if (!user) {
      return next(new ErrorHandler('Password reset token is invalid or has been expired', 400))
  }

  if (req.body.password !== req.body.confirmPassword) {
      return next(new ErrorHandler('Password does not match', 400))
  }

  // Setup new password
  user.password = req.body.password;

  user.resetPasswordToken = undefined;
  user.resetPassowrdExpire = undefined;

  await user.save();

  sendToken(user, 200, res)
});

//get profile > /api/v1/me
exports.getUserProfile = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
      success: true,
      user
  })
});
//Update /change password => /api/v1/password/update
exports.updatePassword= catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id).select('+password');

    // Check previous user password
    const isMatched = await user.comparePassword(req.body.oldPassword)
    if (!isMatched) {
        return next(new ErrorHandler('Old password is incorrect'));
    }

    user.password = req.body.password;
    await user.save();

    sendToken(user, 200, res)

});

//updateProfile =>/api/v1/me/update
exports.updateProfile= catchAsyncErrors(async (req, res, next) => {
  const newuserData = {
    name:req.body.name,
    email:req.body.email
  }
  const user = await User.findByIdAndUpdate(req.user.id,newuserData,{
    new:true,
    runValidators:true,
    useFindAndModify:false
  })

res.status(200).json({
  success:true
})
});


//Logout => /api/v1/logout
exports.Logout = catchAsyncErrors(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });
  res.status(200).json({
    success: true,
    massage: "Logout",
  });
});


//----------------admin--------------------
//get all user =>/api/v1/admin/users
exports.getAllUsers = catchAsyncErrors(async (req, res, next) => {
 const users = await User.find();
 res.status(200).json({
  success:true,
  users
 })
});

//get details => /api/v1/admin/user/:id
exports.getUser = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if(!user){
    return next(new ErrorHandler(`User does not found with this id ${req.params.id}`))
  }
  
  res.status(200).json({
    success:true,
    user
  })
 });

//updateProfile =>/api/v1/admin/user/:id
exports.updateProfileByAdmin= catchAsyncErrors(async (req, res, next) => {
  const newuserData = {
    name:req.body.name,
    email:req.body.email,
    role:req.body.role
  }
  const user = await User.findByIdAndUpdate(req.params.id,newuserData,{
    new:true,
    runValidators:true,
    useFindAndModify:false
  })

res.status(200).json({
  success:true
})
});
//DeleteUserByAdmin =>/api/v1/admin/user/:id

exports.DeleteUserByAdmin= catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.params.id);

    if (!user) {
        return next(new ErrorHandler(`User does not found with id: ${req.params.id}`))
    }

    await user.deleteOne();

    res.status(200).json({
        success: true,
    })
});