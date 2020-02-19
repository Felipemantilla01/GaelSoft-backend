const mongoose = require('mongoose')

const Schema = mongoose.Schema
const userSchema = new Schema({
    name:String,
    lead:String,
    created:{
        at:{ type: Date, default: Date.now }
    },
    repository:String
})

module.exports = mongoose.model('project',userSchema, 'projects')