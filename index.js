//Loads .env file contents into process.env by default
require('dotenv').config()

const express = require('express')
const cors = require('cors')
require('./config/db')
const router = require('./router/route')
// const applicationMiddleware = require('./middlewares/applicationMIddleware')

//create express application
const bookstoreserver = express()

//middleware
//cors- to avoid http blocking while sending request from frontend to backend
bookstoreserver.use(cors())
//express.json()-used for parsing (json - js)
bookstoreserver.use(express.json())

// bookstoreserver.use(applicationMiddleware)
//route
bookstoreserver.use(router)

//file uploading
bookstoreserver.use('/uploads',express.static('./uploads'))

bookstoreserver.get('/',(req,res)=>{
    res.send('BookStore server started...')
})

//listen to server
const PORT= 3000 || process.env.PORT //when deploying port may change process.env.PORT is used to change according to it
bookstoreserver.listen(PORT,()=>{
    console.log(`Book Store server running on the PORT ${PORT}..`);  
})