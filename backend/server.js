const app = require('./app')
const dotenv = require('dotenv')
const connectToDb = require('./config/database')

dotenv.config({path:'./config/config.env'})
//handle uincaught expetion
process.on('uncaughtException',err=>{
    console.log(`Error =>${err.message}`);
    console.log('Shutting down Uncatch expetion');
    process.exit(1)
})

//connect to database
connectToDb();

const server = app.listen(process.env.PORT,()=>{
 console.log(`Server Started on port :${process.env.PORT} in ${process.env.NODE_ENV} mode`);   
})
process.on('unhandledRejection',err=>{
    console.log(`Error => ${err.message}`);
    console.log('Shutting Down the server unhandle promise');
    server.close(()=>{
        process.exit(1)
    })
})