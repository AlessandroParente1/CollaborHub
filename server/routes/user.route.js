const express = require("express");
const router = express.Router();
const {signUp, login, logout, verifyCode, getAllUsers} = require("../controllers/user.controller.js");
const verifyToken = require("../Middleware/verifyToken.js");

router.post("/signUp", signUp);
router.post("/login", login);

router.post("/logout", verifyToken, logout)
router.get('/getAllUsers', verifyToken, getAllUsers);




module.exports = router;