const User = require("../models/user.model.js");
const jsonwebtoken = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const SECRET_KEY = process.env.SECRET_KEY || "";

const  signUp = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        const exsistingUser = await User.findOne({ email });
        if (exsistingUser) {
            return res.status(400).json({msg: "Utente già registrato con questo indirizzo mail!"})
        }
        const exsistingUsername = await User.findOne({ username });
        if (exsistingUsername) {
            return res.status(400).json({msg: "Username già esistente! Scegline un altro"})
        }

        const user = await User.create({ username, email, password })
        const token = jsonwebtoken.sign({id: user._id}, SECRET_KEY, {expiresIn: '1d'})

        res.cookie("jwtToken", token, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            expires: new Date(Date.now() + 1000*60*60*24)
        });

        res.status(201).json({
            msg: 'Utente registrato correttamente!',
            user: {
                _id : user._id,
                username : user.username,
                email : user.email
            },
        })
    }
    catch (err) {
        if (err.name === 'ValidationError') {
            const messages = Object.values(err.errors).map(val => val.message);
            return res.status(400).json({ message: messages.join(', ') });
        } else {
            console.log(err);
            res.status(400).json({msg: err.message})}
    }


};

const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username })
        if (!user) {
            return res.status(400).json({msg: 'Account non esistente con questo username!'})
        } else if (await bcrypt.compare(password, user.password)) {
            const token = jsonwebtoken.sign({id: user._id}, SECRET_KEY, {expiresIn: '1d'})
            res.cookie("jwtToken", token, {
                httpOnly: true,
                //secure: true,
                sameSite: 'strict',
                expires: new Date(Date.now() + 1000*60*60*24)
            }).json({msg: "Accesso effettuato", user: {
                    _id: user._id,
                    username: user.username,
                    email: user.email
                }});
        } else {
            return res.status(400).json({msg: 'Username o password errati'})
        }
    }
    catch (err) {
        console.log(err);
        res.json({msg: "Errore"})
    }

};

const logout = async (req, res) => {
    try {
        const token = req.cookies.jwtToken;
        res.clearCookie("jwtToken", token, { path: "/" });
        res.status(200).json({msg: "Utente disconnesso correttamente"})}
    catch (err){
        res.status(500).json({msg: "Errore durante la disconnessione"})
    }
}

const getAllUsers = async (req, res) => {
    try {
        // Recupera tutti gli utenti dal database
        const users = await User.find({}, '-password'); // Esclude il campo password

        // Risponde con la lista degli utenti
        res.status(200).json({
            success: true,
            users: users,
        });
    } catch (error) {
        console.error('Errore nel recupero degli utenti:', error);

        // Gestione errori
        res.status(500).json({
            success: false,
            message: 'Errore nel recupero degli utenti',
        });
    }
};

const enterChat= async(req,res)=> {
    const {userId, chatWithId} = req.body;

    try {
        const user = await User.findById(userId);

        user.inChatWith = chatWithId;
        await user.save();

        res.status(200).json({ message: "User entered chat", inChatWith: user.inChatWith });
    }catch(error){
        res.status(500).json({ message: "Error entering chat", error });

    }

}

module.exports = {signUp, login, logout, getAllUsers, enterChat};