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

    //Quando un utente fa il login lo aggiungo agli onlineUsers
    socket.on("add-user", (userId)=>{
        onlineUsers.set(userId, socket.id);
    })

    socket.on("send-msg", async (data) => {
        const { from, to, message } = data;

        try {
            // Salva il messaggio nel database
            await addMessage({
                body: {
                    from,
                    to,
                    message,
                },
            });

            const recipientSocketId = onlineUsers.get(to);
            if (recipientSocketId) {
                socket.to(recipientSocketId).emit("msg-recieve", {
                    fromSelf: false,
                    message,
                });
            }

        } catch (error) {
            console.error("Errore durante l'invio del messaggio:", error);
        }
    });

    socket.on("disconnect", () => {
        onlineUsers.forEach((value, key) => {
            if (value === socket.id) {
                onlineUsers.delete(key);
            }
        });
    });


})

//pass db: nE37smGqow3czJ4e


