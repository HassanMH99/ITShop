const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("./catchAsyncErrors");
const jwt = require('jsonwebtoken')
const User = require('../models/user')
//check if user auth or not 
exports.isAuthUser = catchAsyncErrors(async (req,res,next)=>{
    const { token } = req.cookies

    if (!token) {
        return next(new ErrorHandler('Login first to access this resource.', 401))
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = await User.findById(decoded.id);

    next()

})
//Authurize roles
exports.AuthRoles = (...roles)=>{
    return (req,res,next)=>{
        if(!roles.includes(req.user.role)){
            return next(
            new ErrorHandler(`Role ${req.user.role} Not allowed to do this`,403)
            )}
        next()
    }
}