
const mongoose = require('mongoose')

const connectdb  = async ()=>{
  
    try{
await mongoose.connect(process.env.MONGO_URL)
console.log('mongo connected')
    } catch(err){
console.log('error', err)
    }
}

module.exports = connectdb;