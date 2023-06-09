const ErrorHandler = require('../utils/errorHandler')

module.exports = (err,req,res,next)=>{
    err.statusCode = err.statusCode || 500;
    if(process.env.NODE_ENV === 'DEVELOPMENT'){
        res.status(err.statusCode).json({
            success:false,
            error:err,
            errMassage:err.message,
            stack:err.stack
        })
        if(process.env.NODE_ENV === 'PRODUCTION'){
            let error = {...err}
            error.message = err.message;
            //Wrong mongoose id error
            if(err.name ==='CastError'){
                const massage = `Resourcee not found. Invalid ${err.path}`
                error = new ErrorHandler(massage,400)
            }
            //Mongoose Val Error
            if(err.name=='ValidationError'){
                const massage = Object.values(err.errors).map(value.massage);
                error = new ErrorHandler(massage,400)
            }
                //handle mongooese error
                if(err.code === 11000){
                    const massage = `Duplicate ${Object.keys(err.keyValue)} enterd`
                    error = new ErrorHandler(massage,400)

                } 
                //handling wrong JWT Error
                if(err.name=='JsonWebTokenError'){
                    const massage = `JSON Web is invalid try again`
                    error = new ErrorHandler(massage,400)
                }
                 //handling expired JWT Error
                 if(err.name=='TokenExpiredError'){
                    const massage = `JSON Web is expired try again`
                    error = new ErrorHandler(massage,400)
                }
                    
            res.status(error.statusCode).json({
                success:false,
                message:error.message || 'Internal Server Error'
            })
        }
    }
    res.status(err.statusCode).json({
        success:false,
        error:err
    })
}