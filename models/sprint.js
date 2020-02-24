const mongoose = require('mongoose')

const Schema = mongoose.Schema
const userSchema = new Schema({
    name:String,
    project:{
        _id:{type:String, defaul:null}
    },
    created:{
        at:{ type: Date, default: Date.now }
    },
    time:{
        start: { type: Date, default: null },
        end: { type: Date, default: null }
    },
    duration:{ type: String, default: '' },
    description:String,
    state:{type:String, default:'inactive'}
})

module.exports = mongoose.model('sprint',userSchema, 'sprints')