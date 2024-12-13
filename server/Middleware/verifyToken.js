const jsonwebtoken = require("jsonwebtoken");
const User = require("../models/user.model.js");

const SECRET_KEY = process.env.SECRET_KEY || "";

const verifyToken = async (req, res, next) => {
    try {
        const token = req.cookies.jwtToken;
        if (token) {
            jsonwebtoken.verify(token, SECRET_KEY, async (err, data) => {
                if (err) {
                    return (res.json({msg: "errore", errore: "Token non valido"}))
                } else {
                    const user = await User.findById({_id: data.id })
                    if (user) {
                        req.user = user; // Aggiungiamo l'utente alla richiesta
                        next(); // Prosegui con la route
                    } else {
                        res.json({msg: "errore", errore: "Utente non trovato"})
                    }}
            })
        }
        else {
            return res.status(401).json({msg: "Accesso non consentito"})
        }
    }
    catch (err) {
        console.log(err);
        res.json({msg: "errore", errore: err.message})
    }
}

module.exports = verifyToken;