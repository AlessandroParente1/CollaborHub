const User = require("../models/user.model.js");
const jsonwebtoken = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const nodemailer =require('nodemailer');
const randomize = require('randomatic');
const cloudinary = require("../config/cloudinaryConfig");

const SECRET_KEY = process.env.SECRET_KEY || "";

async function sendOtpEmail(email, otp) {

try{
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "OTP Verification",
        text: `Your OTP is: ${otp}`,
    };

    const info =
        await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + info.response);

} catch (error) {
    console.error('Error sending email:', error);
}

}

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

        const pwdRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
        if (!pwdRegex.test(password)) {
            return res.status(400).json({
                msg: "La password deve essere lunga almeno 6 caratteri, contenere almeno un numero e un carattere speciale (@$!%*?&)."
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({ username, email, password:hashedPassword })
        const token = jsonwebtoken.sign({id: user._id}, SECRET_KEY, {expiresIn: '1d'})

        res.cookie("jwtToken", token, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            expires: new Date(Date.now() + 1000*60*60*24)
        });

        res.status(201).json({
            msg: 'Utente registrato correttamente!',
            success:true,
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

            const otp =randomize("0",6); //Genera un Otp a 6 cifre
            const otpExpiry= new Date(Date.now()+5*60*1000); //Otp valido per 5 minuti

            user.otp= otp;
            user.otpExpiresAt= otpExpiry;
            await user.save();

            await sendOtpEmail(user.email, otp);

            return res.status(200).json({
                success:true,
                msg: "OTP inviato al tuo indirizzo email. Inseriscilo per completare l'accesso.",
                userId: user._id,
            });

        } else {
            return res.status(400).json({msg: 'Username o password errati'})
        }
    }
    catch (err) {
        console.error('Errore durante il login:', err.message);
        return res.status(500).json(
            {
                success: false,
                message: 'Errore durante il login'
            }
        );
    }

};

const verifyOtp = async(req,res)=>{
    try {
        const { otp } = req.body;
        console.log(otp);

        const user = await User.findOne({otp});

        if (!user || user.otp !== otp || user.otpExpiresAt < new Date()) {
            return res.status(400).json({
                success: false,
                msg: "OTP non valido o scaduto"
            });
        }

        user.otp = '';
        user.otpExpiresAt = null;
        await user.save();

        const token = jsonwebtoken.sign({id: user._id}, SECRET_KEY, {expiresIn: '1d'})

        res.cookie("jwtToken", token, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            expires: new Date(Date.now() + 1000*60*60*24)
        }).json({
            success:true,
            msg: "Accesso effettuato",
            user: {
                _id: user._id,
                username: user.username,
                email: user.email
            }});

    } catch (err) {
        console.error('Errore durante la verifica dell OTP:', err.message);
        return res.status(500)
            .json(
                {
                    success: false,
                    message: 'Errore durante la verifica dell OTP'
                }
            );
    }
}

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

const addAvatar= async(req, res)=>{
    try {
        const { userId } = req.body;
        //l'immagine si trova in req.file.buffer

        if (!userId) {
            return res.status(400).json({ msg: "userId non fornito" });
        }

        if (!req.file || !req.file.buffer) {
            return res.status(400).json({ msg: "Immagine non fornita" });
        }

        //Conversione dell'immagine in formato Base64
        const b64 = Buffer.from(req.file.buffer).toString("base64");
        let dataURI = "data:" + req.file.mimetype + ";base64," + b64;
        //Upload dell'immagine su cloudinary
        const cldRes = await handleUpload(dataURI);

        console.log("Avatar uploaded to Cloudinary:", cldRes.secure_url);

        // Aggiorna l'avatar dell'utente
        const user = await User.findByIdAndUpdate(
            userId,
            { avatar: cldRes.secure_url },
            { new: true }

        );
        console.log('user',user);

        if (!user) {
            return res.status(404).json({ msg: "Utente non trovato" });
        }

        res.status(200).json({ success:true, user:user });
    }
    catch (error) {
        console.log(error);
        res.send({message: error.message,});
    }
}

const handleUpload = async (file)=>{
    const res = await cloudinary.uploader.upload(file, {
        resource_type: "auto", //permette a cloudinary di rilevare automaticamente il tipo di file
    });
    return res;
}

module.exports = {signUp, login, logout, getAllUsers, verifyOtp, addAvatar};