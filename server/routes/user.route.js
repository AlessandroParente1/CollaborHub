const express = require("express");
const router = express.Router();
const {signUp, login, logout, getAllUsers, verifyOtp, addAvatar} = require("../controllers/user.controller.js");
const verifyToken = require("../Middleware/verifyToken.js");

//per caricare le immagini
const Multer = require("multer");
const storage = new Multer.memoryStorage();
const upload = Multer({storage});

router.post("/signUp", signUp);
router.post("/login", login);
router.post('/verifyOtp',verifyOtp);

router.post("/logout", logout)
router.get('/getAllUsers', verifyToken, getAllUsers);
router.post("/addAvatar", verifyToken, upload.single("image"),express.json(), addAvatar);



module.exports = router;