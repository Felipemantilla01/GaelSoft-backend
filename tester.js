

/** Database dependecies */
const db = 'mongodb://localhost:27017/GaelSoft'
const User = require('./models/user')
const Task = require('./models/task')
const Project = require('./models/project')
const Sprint = require('./models/sprint')
const mongoose = require('mongoose')

mongoose.connect(db, err => {
    if (err) {
        //message.error('Error Conneting to the DataBase ', from)
    } else {
        //message.success('Connected to the Database', from)
    }
})




async function main(userId){

    // let partProjects = await Project.find({ participants: { _id:'5e4db0c304d08676c23e28ed', username:'felipemantilla01' } })
    // console.log(partProjects)

    
}

main('5e4db0c304d08676c23e28ed')