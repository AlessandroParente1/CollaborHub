const User = require("../models/user.model.js");
const passport = require("passport");
const jsonwebtoken = require("jsonwebtoken");

const SECRET_KEY = process.env.SECRET_KEY || "";

const register = (req, res) => {
    const newUser = new User({email: req.body.email}); //Crea l'user e gli chiede come param l'email
    User.register(newUser, req.body.password, (err, user) => {
        if (err) {
            res.status(500).json({success: false, error: err});
        } else {
            res.status(200).json({success: true, message: 'Account created successfully'});
        }
    });
};

const login = (req, res) => {
    passport.authenticate(
        "local",
        (error, user) => {
            if (error) {
                return res.status(500).json({message: error});
            } else {
                if (!user) {
                    res.status(403).json({success: false, message: "Email o password errate."});
                } else {
                    const token = jsonwebtoken.sign(
                        {
                            data: {
                                userId: user._id,
                                email: user.email
                            },
                            exp: new Date().setDate(new Date().getDate() + 1) // expires in 24h
                        },
                        SECRET_KEY
                    );
                    res.status(201).json({
                        success: true,
                        message: "Login successful",
                        token: token
                    });
                }
            }
        })(req, res);
}



module.exports = {register, login};
