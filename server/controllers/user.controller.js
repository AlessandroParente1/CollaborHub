const User = require("../models/user.model.js");
const jsonwebtoken = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const nodemailer = require('nodemailer');
const crypto = require('crypto');


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

        // Invia il codice di verifica via email
        await sendVerificationCode(email, user._id);

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
        } else if (!await bcrypt.compare(password, user.password)) {
            return res.status(400).json({ msg: 'Username o password errati' });
        } else {
            // Invia il codice di verifica via email
            await sendVerificationCode(user.email, user._id);

            res.status(200).json({msg: 'Codice di verifica inviato. Controlla la tua email!'});

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

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'collaborhub-noreply@gmail.com',
        pass: process.env.EMAIL_PASS,
    },
});

const sendVerificationCode = async (email, userId) => {
    const code = crypto.randomInt(100000, 999999); // Genera un codice a 6 cifre

    // Salva il codice nel database associato all'utente
    await User.findByIdAndUpdate(userId, { verificationCode: code });

    // Configura il contenuto dell'email
    const mailOptions = {
        from: 'collaborhub-noreply@gmail.com',
        to: email,
        subject: 'Codice di verifica',
        text: `Il tuo codice di verifica è: ${code}`,
    };

    // Invia l'email
    try {
        await transporter.sendMail(mailOptions);
        console.log(`Codice inviato a ${email}`);
    } catch (err) {
        console.error('Errore nell\'invio del codice di verifica:', err);
        throw new Error('Errore nell\'invio del codice di verifica');
    }
};

const verifyCode = async (req, res) => {
    try {
        const { userId, code } = req.body;

        // Recupera l'utente e verifica il codice
        const user = await User.findById(userId);
        if (!user || user.verificationCode !== parseInt(code, 10)) {
            return res.status(400).json({ msg: 'Codice non valido o scaduto' });
        }


        // Genera un token JWT e completa il login
        const token = jsonwebtoken.sign({ id: user._id }, SECRET_KEY, { expiresIn: '1d' });
        res.cookie('jwtToken', token, {
            httpOnly: true,
            //secure: true,
            sameSite: 'strict',
            expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
        });

        res.status(200).json({ msg: 'Accesso completato con successo!', user: { id: user._id, username: user.username, email: user.email } });
    } catch (err) {
        console.log(err);
        res.status(500).json({ msg: 'Errore durante la verifica del codice' });
    }
};


const getAllUsers = async (req, res) => {
    try {
        // Recupera tutti gli utenti dal database
        const users = await User.find({}, '-password'); // Esclude il campo password

        // Risponde con la lista degli utenti
        res.status(200).json({
            success: true,
            data: users,
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



module.exports = {signUp, login, logout, getAllUsers, verifyCode};
