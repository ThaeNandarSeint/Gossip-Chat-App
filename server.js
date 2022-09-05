require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const fileUpload = require('express-fileupload')

const app = express()
app.use(express.json())
app.use(cors())
app.use(cookieParser())
app.use(fileUpload({
    useTempFiles: true
}))

// Routes
const userRoute = require('./routes/userRouter')
const upload = require('./routes/upload')
const messageRoute = require('./routes/messageRouter')

app.use('/user', userRoute)
app.use('/api', upload)
app.use('/messages', messageRoute)

// connect to mongodb
const MONGODB_URL = process.env.MONGODB_URL
mongoose.connect(MONGODB_URL).then(()=>console.log("Mongodb is connected")).catch((err)=>console.log(err))

// server
const PORT = process.env.PORT || 5000
const server = app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`)
})

// socket setup
const socket = require('socket.io')
const CLIENT_URL = process.env.CLIENT_URL
const io = socket(server, {
    cors:{
        origin: `${CLIENT_URL}`,
        credentials: true
    }
})

let activeUsers = []
io.on('connection', (socket) => {
    // add new user
    socket.on('new-user-add', (newUserId) => {
        // if user is not added
        if(!activeUsers.some((user)=> user.userId === newUserId)){
            activeUsers.push({
                userId: newUserId,
                socketId: socket.id
            })
        }
        io.emit('get-users', activeUsers)
    })
    socket.on('disconnect', () => {
        activeUsers = activeUsers.filter((user) => user.socketId !== socket.id)
        io.emit('get-users', activeUsers)
    })
    socket.on('send-msg', (data)=>{
        const receiverId = data.to;
        const user = activeUsers.find((user) => user.userId === receiverId)
        if(user){
            socket.to(user.socketId).emit('msg-receive', data.message)
        }
    })
})

// ----------------- Deployment -------------------------
if(process.env.NODE_ENV === 'production'){
    const path = require('path')
    app.get('/', (req, res)=>{
        app.use(express.static(path.resolve(__dirname, 'client', 'build')))
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
    })
}