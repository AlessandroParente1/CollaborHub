const express = require('express');
const dotenv= require ('dotenv');
const cors =require('cors');
const cookieParser =require('cookie-parser');
const mongoose = require('mongoose'); //Inizializzo Mongoose
dotenv.config();

//Session Imports
const User = require("./models/user.model.js");
const passport = require("passport");

const app = express();
app.use(express.json());
app.use(cookieParser);
app.use(cors());
app.use(express.urlencoded({extended: true})); //Affinchè possa prendere dai form i campi //secret passcode
app.use(passport.initialize());

//passport
passport.use(User.createStrategy());  //User.createStrategy() è una funzione di passport-local-mongoose che setta automaticamente una strategia


//socket.io
const http = require('http');
// Creazione del server HTTP per usare Socket.io
const server = http.createServer(app);
// Aggiungi Socket.io al server
const io = require('socket.io')(server, {
    cors: {
        origin: '*', // Permetti le connessioni da qualsiasi origine (per lo sviluppo)
        methods: ['GET', 'POST']
    }
});


app.use('api/login',require('./routes/user.route.js'));
app.use('api/register',require('./routes/user.route.js'));
app.use('api/profile',require('./routes/user.route.js'));
app.use('api/logout',require('./routes/user.route.js'));
app.use('api/chats',require('./routes/chats.route.js'));


mongoose.connect(process.env.MONGO_URL)
    .then(() => {
        console.log("Connected to database");

        // Inizializza la connessione Socket.io
        io.on('connection', (socket) => {
            console.log("User connected: " + socket.id);

            // Gestione dei messaggi (ad esempio, per la chat)
            socket.on('send_message', (data) => {
                console.log("Messaggio ricevuto:", data);
                // Invia il messaggio a tutti i client connessi
                io.emit('receive_message', data);
            });

            socket.on('disconnect', () => {
                console.log("User disconnected: " + socket.id);
            });
        });

        // Start the Express server
        server.listen(process.env.PORT, () => {
            console.log(`Server listening on port ${process.env.PORT}`);
        });
    })
    .catch((e) => {
        console.log(e);
    });


//pass db: nE37smGqow3czJ4e


