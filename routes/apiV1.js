/** environments */
let environment = require('../environments/environment')

/** functions */
var message = require('../functions/messages')
const from = 'API router V1'
/** dependecies */
var express = require('express')
var router = express.Router()
var tasks = require('../DB/tasks.json')

/** bcrypt */
const bcrypt = require('bcrypt');
const saltRounds = 10;

/** Database dependecies */
const db = 'mongodb://localhost:27017/GaelSoft'
const User = require('../models/user')
const mongoose = require('mongoose')

mongoose.connect(db, err => {
    if (err) {
        message.error('Error Conneting to the DataBase ', from)
    } else {
        message.success('Connected to the Database', from)
    }
})

/** routes for users */
router.post('/register', (req, res) => {
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
                bcrypt.hash(environment.bcryptPassword, saltRounds, (error, hash) => {
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
                message.warning(response, from)
                res.status(400).send(`User already exists`)
            }
        }
    })/** end verify the user email dont exists yet */




})










router.get('/', (req, res) => {
    res.status(200).send({ status: 'ok', api: 'api v1', desc: 'first implementation' })
})

router.get('/tasks', (req, res) => {
    res.status(200).send(tasks)
})



module.exports = router