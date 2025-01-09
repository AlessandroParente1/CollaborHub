const express = require('express');
const dotenv= require ('dotenv');
const cors =require('cors');
const cookieParser =require('cookie-parser');
const mongoose = require('mongoose'); //Inizializzo Mongoose
dotenv.config();
const app = express();
const {Server} = require('socket.io');


app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin:"https://collaborhub-frontend.onrender.com || http://localhost:3000",  // L'indirizzo del frontend
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
        origin: 'https://collaborhub-frontend.onrender.com',
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

    socket.on("send-msg", async (data)=>{
        const recipientSocket = onlineUsers.get(data.to);
        console.log('recipientSocket testo', recipientSocket);

        if(recipientSocket){
            socket.to(recipientSocket).emit("msg-receive", {
                message: {
                    from: data.from,
                    to: data.to,
                    message: data.message,
                },
            });
            console.log("Messaggio inviato:", data);

        }
    })

    socket.on('send-image',(data)=>{
        const recipientSocket = onlineUsers.get(data.to);
        console.log('data immagine:', data);
        console.log('recipientSocket immagine', recipientSocket);
        if(recipientSocket){
            socket.to(recipientSocket).emit('img-receive', {image: data.image,});
            console.log('url immmaine:'+ data.image);
            console.log('Invio immagine a', data.to, 'con URL:', data.image);

        }
    })


    socket.on("user-typing",async (data)=>{
        const recipientSocket = onlineUsers.get(data.to);

            if (recipientSocket) {
                socket.to(recipientSocket).emit("user-typing-receive", data);
            }


    })
    socket.on("user-stopped-typing",async(data)=>{
        const recipientSocket = onlineUsers.get(data.to);

            if (recipientSocket) {
                socket.to(recipientSocket).emit("user-stopped-typing-receive");
            }


    })

})

//pass db: nE37smGqow3czJ4e

