const Product = require('../models/product')
const dotenv = require('dotenv')
const products = require('../data/products.json')
const connectToDb = require('../config/database')

dotenv.config({path:'../config/config.env'})
connectToDb();

const seedProducts = async ()=>{
    try{
        await Product.deleteMany();
        console.log('Products are deleted');
        await Product.insertMany(products)
        console.log('All Products are added');
        process.exit();

    }catch(error){
        console.log(error.message);
        process.exit();
    }
}
seedProducts()