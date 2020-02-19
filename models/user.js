const mongoose = require('mongoose')

const Schema = mongoose.Schema
const userSchema = new Schema({
    email:String,
    password:String,
    username:String,
    role:{ type: String, default: 'user' },
    created:{
        at:{ type: Date, default: Date.now },
    },
    state:{
        active:{type:Boolean, default:true}
    }
})

module.exports = mongoose.model('user',userSchema, 'users')