/** functions */
var message = require('./functions/messages')
const from = 'Index'
/** services */
const environment = require('./environments/environment')
const apiV1 = require('./routes/apiV1')
const apiInfo = require('./package.json')


/** dependencies */
const express = require('express')
const app = express()
const cors = require('cors')
var bodyParser = require('body-parser')

/** middlewares */
app.use(cors())
app.use(bodyParser.json())

/** Routes versioning */
app.use('/api/v1', apiV1)


/** welcome message */
app.get('/', (req,res)=>{
    res.status(200).json(apiInfo)    
})

app.listen(environment.PORT, ()=>{
    message.success(`APIServer on port : ${environment.PORT}`, from)
})