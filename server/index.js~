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
    origin:"https://collaborhub-frontend.onrender.com",  // L'indirizzo del frontend
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
    },
});
//Crea una mappa globale (Map) per tenere traccia degli utenti online e delle loro connessioni WebSocket
global.onlineUsers = new Map();

io.on("connection", (socket)=>{
    console.log('connect to socket', socket.id);
    global.chatSocket = socket;

    socket.on("add-user", (userId)=>{
        onlineUsers.set(userId, socket.id);
        io.emit("update-online-users", Array.from(onlineUsers.keys()));
    })

    socket.on("get-online-users", () => {
        socket.emit("update-online-users", Array.from(onlineUsers.keys()));
    });

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

    socket.on("disconnect", () => {
        onlineUsers.forEach((value, key) => {
            if (value === socket.id) {
                onlineUsers.delete(key);
            }
        });
        io.emit("update-online-users", Array.from(onlineUsers.keys())); // Emit aggiornamento lista utenti online
        console.log('user disconnnesso', socket.id);
    });

    socket.on("send-notification", async(data)=>{
        const recipientSocket = onlineUsers.get(data.to);

        if (recipientSocket) {
            socket.to(recipientSocket).emit("notification-receive", data);
        }

    })

})

//pass db: nE37smGqow3czJ4e

