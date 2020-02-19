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
    message.info(req.userId,from)
    next()
}
/** routes for users */
router.post('/register', (req, res) => {
    header.setHeaders(res)

    let userData = req.body

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
                     res.status(200).send({ token })
                    }
                    else{
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

    console.log(task)
    task.save((err,taskSaved)=>{
        if(err){
            res.status(500).send('Error trying to save the task, try again')
        }else{
            res.status(200).send(taskSaved)
        }
    })
    
})

router.put('/tasks', verifyToken, (req,res)=>{
    taskData = req.body
    console.log(taskData)

    if (taskData.state === "inProgress") {
        Task.findByIdAndUpdate(taskData._Id, {
            "state": {
                "todo": {
                    "state": "inactive"
                },
                "inProgress": {
                    "state": "active",
                    "at": Date.now
                }
            }
        }, (err, response)=>{
            if(err){
                res.status(500).send('Error trying to update the task, try again')
            }else{
                res.status(200).send(response)
            }
        } )
    }
    if(taskData.state==="done"){

    }


})



module.exports = router