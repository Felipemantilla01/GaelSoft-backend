/** environments */
let environment = require('../environments/environment')

/** functions */
var message = require('../functions/messages')
const from = 'API router V1'
var header = require('../functions/headers')
/** dependecies */
var express = require('express')
var router = express.Router()
var tasksJSON = require('../DB/tasks.json')

/** jwt */
const jwt = require('jsonwebtoken')

/** bcrypt */
const bcrypt = require('bcrypt');
const saltRounds = 10;

/** Database dependecies */
const db = 'mongodb://localhost:27017/GaelSoft'
const User = require('../models/user')
const Task = require('../models/task')
const Project = require('../models/project')
const mongoose = require('mongoose')

mongoose.connect(db, err => {
    if (err) {
        message.error('Error Conneting to the DataBase ', from)
    } else {
        message.success('Connected to the Database', from)
    }
})


function verifyToken(req, res, next) {
    //console.log(req.headers)
    if (!req.headers.authorization) {
        return res.status(401).send('Unauthorized request')
    }
    let token = req.headers.authorization.split(' ')[1]
    //console.log(token)
    if (token === 'null') {
        return res.status(401).send('Unauthorized request')
    }
    let payload = jwt.verify(token, environment.secretKey)
    if (!payload) {
        return res.status(401).send('Unauthorized request')
    }
    req.username = payload.subject
    //message.info(req.username,from)
    next()
}
/** routes for users */
router.post('/register', async (req, res) => {
    header.setHeaders(res)

    let userData = req.body

    let response = await User.findOne({username:userData.username})
    if(response!==null)
    {
        res.status(400).send('Username already exists')
        return(0)
    }

    /** verify the user email dont exists yet*/
    User.findOne({ email: userData.email }, (error, response) => {
        if (error) {
            message.error(`Error verifying the email`, from)
            res.status(500).send(`Error verifying the email ${userData.email}`)
        }
        else {
            if (response === null) {
                /** hashing the password */
                bcrypt.hash(userData.password, saltRounds, (error, hash) => {
                    if (error) {
                        message.error(`Error hashing the password`, from)
                        res.status(500).send(`Error registring the user ${userData.email}`)
                    }
                    else {
                        userData.password = hash
                        let user = new User(userData)
                        user.save((error, userRegistered) => {
                            if (error) {
                                message.error(`Error registring the new user`, from)
                                res.status(500).send(`Error registring the user ${userData.email}`)
                            } else {
                                res.status(200).send({ email: userRegistered.email, _id: userRegistered._id })
                            }
                        })/**end saving user */
                    }
                })/** end hashing password */
                /** saving the user*/
            }
            else {
                //message.warning(response, from)
                res.status(400).send(`User already exists`)
            }
        }
    })/** end verify the user email dont exists yet */
})

router.post('/login', (req,res)=>{
    header.setHeaders(res)


    let userData = req.body
    

    User.findOne({email:userData.email}, (error, user)=>{
        if(error){
            message.error(`Error trying to verify the user ${userData.email}`,from)
            res.status(401).send(`Error trying to verify the user ${userData.email}`)
        }else{
            if(!user){
                res.status(401).send('Invalid email')
            }
            else{           

                bcrypt.compare(userData.password,user.password).then(same=>{
                    if(same){
                        let payload = { subject: user.username}
                        let token = jwt.sign(payload, environment.secretKey/*, { expiresIn: 60 * 60 }*/)
                        res.status(200).send(
                            {
                                token,
                                username: user.username,
                                role:user.role
                            }
                        )
                    }
                    else {
                        res.status(401).send('Invalid password')
                    }
                })
            }
                
        }  

    })

    

})

router.get('/users', (req,res)=>{
    header.setHeaders(res)
    User.find({}, (err,users)=>{
        if(err){
            res.status(500).send('Server error')
        }else{
            res.status(200).send(users)
        }
    })
})


/** directories */

router.get('/', (req, res) => {
    res.status(200).send({ status: 'ok', api: 'api v1', desc: 'first implementation' })
})

router.get('/tasks', verifyToken,(req, res) => {
    
    Task.find({}, (err, tasks)=>{
        if(err){
            res.status(500).send('Error Capturing the tasks')
        }else{
            res.status(200).send(tasks)
        }
    })

})

router.post('/tasks', verifyToken, (req,res)=>{
    message.error(req.username,from)
    let taskData = req.body
    let task = new Task(taskData)
    task.created.by=req.username

    //console.log(task)
    task.save((err,taskSaved)=>{
        if(err){
            res.status(500).send('Error trying to save the task, try again')
        }else{
            res.status(200).send(taskSaved)
        }
    })
    
})

router.put('/tasks', verifyToken, async (req,res)=>{
    taskData = req.body
    //console.log(taskData)

    if (taskData.state === "inProgress") {
        try {
            let doc = await Task.findById(taskData._id)        
            doc.state.todo.state = "inactive"
            doc.state.inProgress = {
                state: "active",
                at: new Date
            }
            
            doc = await Task.updateOne({_id:taskData._id},doc)
            //console.log(doc)
            res.status(200).send(doc)
        } catch (e) {
            res.status(500).send('Error updating the task, try again')
        }
    }
    if (taskData.state === "done") {
        try {
            let doc = await Task.findById(taskData._id)

            if(doc.state.inProgress.at===null){
                doc.state.inProgress.at = new Date
            }

            doc.state.todo.state = "inactive"
            doc.state.inProgress.state = "inactive"
            doc.state.done = {
                state: "active",
                at: new Date
            }
            doc = await Task.updateOne({_id:taskData._id},doc)
            //console.log(doc)            
            res.status(200).send(doc)
            
        } catch (e) {
            res.status(500).send('Error updating the task, try again')
        }
    }


})

router.delete('/tasks/:id', verifyToken, async (req,res)=>{
    
    let _id = req.params.id

    try{    
        await Task.deleteOne({_id})
        res.status(200).send('task deleted successfully')

    }catch(e){
        res.status(500).send('Error deleting the task, try again')
    }


    

})


router.get('/tasks/:id/comments', verifyToken, async (req,res)=>{
    let _id = req.params.id
    
    try{
        let task = await Task.findOne({_id})
        res.status(200).send(task.comments)
    }catch(e){
        res.status(500).send('Error capturing the comments')
    }
    
})

router.post('/tasks/:id/comments', verifyToken, async (req, res) => {
    try {
        let taskData = req.body
        var newComment = {
            at: new Date,
            message: taskData.comment
        }

        let task = await Task.findOne({ _id: taskData._id })

        task.comments[task.comments.length] = newComment

        let response = await Task.updateOne({ _id: taskData._id }, task)

        // console.log(response)
        res.status(200).send(response)


    } catch (error) {
        res.status(500).send('Error updating the comments')
    }

})

router.post('/projects', verifyToken, async (req,res)=>{
    let projectData = req.body
    projectData.lead = req.username

    // console.log(projectData)

    let project = new Project(projectData)
    project.save((err,projectSaved)=>{
        if(err){
            res.status(500).send('Error trying to save the project, try again')
        }else{
            res.status(200).send(projectSaved)
        }
    })

})

router.get('/projects', verifyToken, async (req,res)=>{
   
    
    try {
        let projects = await Project.find({})
        res.status(200).send(projects)
        // console.log(projects)
    } catch (error) {
        res.status(500).send('Error capturing the projects')
    }
    

   

})



module.exports = router