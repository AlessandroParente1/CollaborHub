const express = require('express');
const mongoose = require('mongoose');
const dotenv= require ('dotenv');
const jwt =require ('jsonwebtoken');
const User = require('./models/user.model');
const cors =require('cors');
const cookieParser =require('cookie-parser');
const bcrypt =require('bcryptjs');

dotenv.config();
mongoose.connect(process.env.MONGO_URL, (error)=>{
    if(error) throw error;
})


const app = express();
app.use(express.json());
app.use(cookieParser);
app.use(cors
({
    credentials:true,
    origin:process.env.CLIENT_URL
}));

app.get('/test', (req, res) => {
    res.json('test ok');

})

app.get('/profile', (req, res) => {
    const {token} =req.cookies?.token;//? in caso non esiste
    if(token) {
        jwt.verify(token, process.env.SECRET_KEY, {}, (err, userData) => {
            if (err) throw err;
            else res.json(userData);
        });
    }else{
        res.status(401).json('no token');//unauthorized
    }

})

app.post('/login', async (req,res)=> {
    const {username, password} = req.body;
    const foundUser = await User.findOne({username: username});
    if (foundUser) {
        const passOk = bcrypt.compareSync(password, foundUser[0].password);
        if (passOk) {
            jwt.sign({userId: foundUser[0]._id, username}, process.env.SECRET_KEY, {}, (err, token) => {//le parentesi graffe sono vuote perchè vuole 4 parametri obbligatoriamente
                if (err) {
                    throw err
                } else {
                    res.cookie('token', token, {sameSite: 'none', secure: true}).status(201).json({
                        id: foundUser[0]._id,

                    });
                }


            })
        }
    }
})

app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    try{
        const hashedPassword=bcrypt.hashSync(password, 10);
        const createdUser = await User.create({
            username:username,
            password:hashedPassword});
        jwt.sign({userId:createdUser[0]._id, username}, process.env.SECRET_KEY, {},(err, token) => {//le parentesi graffe sono vuote perchè vuole 4 parametri obbligatoriamente
            if (err) {
                throw err
            } else {
                res.cookie('token', token, {sameSite:'none', secure:true}).status(201).json({
                    id:createdUser[0]._id,

            });
            }
        })
    }catch (err){
        if (err) throw err;
        res.status(500).json('error');
    }

})

//pass db: nE37smGqow3czJ4e
app.listen(3001);
