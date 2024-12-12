const jsonwebtoken = require("jsonwebtoken");
const User = require("../models/user.model.js");

const SECRET_KEY = process.env.SECRET_KEY || "";

function verifyToken(req, res, next) {
    const token = req.cookies.token; // Prendiamo il token dai cookies

    if (!token) {
        return res.status(401).json({error: true, message: "Token mancante"});
    }

    jsonwebtoken.verify(token, SECRET_KEY, async (err, payload) => {
        if (err) {
            return res.status(401).json({error: true, message: "Token non valido"});
        }

        try {
            const user = await User.findById(payload.data.userId);
            if (!user) {
                return res.status(403).json({error: true, message: "Utente non trovato"});
            }
            req.user = user; // Aggiungiamo l'utente alla richiesta
            next(); // Prosegui con la route
        } catch (err) {
            return res.status(500).json({error: true, message: "Errore nel server"});
        }
    });
}

module.exports = verifyToken;
