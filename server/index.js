const express = require('express');
const dotenv= require ('dotenv');
const cors =require('cors');
const cookieParser =require('cookie-parser');
const mongoose = require('mongoose'); //Inizializzo Mongoose
dotenv.config();
const app = express();
const http = require('http');
const {Server} = require('socket.io');
const {addMessage} = require("./controllers/message.controller");

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin:"http://localhost:3000",  // L'indirizzo del frontend
    credentials: true  // Per i cookie
}));
app.use(express.urlencoded({extended: true})); //Affinchè possa prendere dai form i campi //secret passcode



app.get('/', (req, res) => {
    res.send('Server is running');
});
app.use('/api/user',require('./routes/user.route.js'));
app.use('/api/message',require('./routes/message.route.js'));



mongoose.connect(process.env.MONGO_URL)
const db = mongoose.connection;
db.once("open", () => {console.log("Database connesso con successo")});


const server = app.listen(process.env.PORT,()=>{
    console.log(`Server running on Port ${process.env.PORT}`);
})
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST'],
        credentials: true,
    },
});
//Crea una mappa globale (Map) per tenere traccia degli utenti online e delle loro connessioni WebSocket
global.onlineUsers = new Map();

io.on("connection", (socket)=>{
    console.log('connect to socket', socket.id);
    global.chatSocket = socket;

    socket.on("add-user", (userId)=>{
        onlineUsers.set(userId, socket.id);
    })

    socket.on("send-msg", (data)=>{
        const sendUnderSocket = onlineUsers.get(data.to);
        if(sendUnderSocket){
            socket.to(sendUnderSocket).emit("msg-receive", data.message)
        }
    })

    socket.on("send-notification", (data)=>{
        const sendUnderSocket = onlineUsers.get(data.to);
        if(sendUnderSocket){
            socket.to(sendUnderSocket).emit("notification-receive",data.message)
        }
    })

    socket.on("user-typing",(data)=>{
        const sendUnderSocket = onlineUsers.get(data.to);
        if(sendUnderSocket){
            socket.to(sendUnderSocket).emit("user-typing-receive");
        }

    })
    socket.on("user-stopped-typing",(data)=>{
        const sendUnderSocket = onlineUsers.get(data.to);
        if(sendUnderSocket){
            socket.to(sendUnderSocket).emit("user-stopped-typing-receive");
        }

    })

})

//pass db: nE37smGqow3czJ4e


