const mongoose = require('mongoose')

const Schema = mongoose.Schema
const taskSchema = new Schema({
    title:String,
    description:String,
    project:String,
    type:{
        name:String,
        icon:String
    },
    priority:{
        name:String,
        icon:String,
        color:String
    },
    assignee:{        
        at:{ type: Date, default: Date.now },
        to:{ type: String, default: 'MASTER' }
    },
    created:{
        at: { type: Date, default: Date.now },
        by: { type: String, default: null }
    },
    state:{
        todo:{
            state: { type: String, default: 'active' }
        },
        inProgress:{
            state:{ type: String, default: 'inactive' },
            at:{ type: Date, default: null }
        },
        done:{
            state:{ type: String, default: 'inactive' },
            at:{ type: Date, default: null }
        }
    },
    comments:[{message:String, at:Date}]

})

module.exports = mongoose.model('task',taskSchema, 'tasks')