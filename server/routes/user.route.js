const express = require("express");
const router = express.Router();
const {signUp, login, logout, verifyCode, getAllUsers} = require("../controllers/user.controller.js");
const verifyToken = require("../Middleware/verifyToken.js");

router.post("/signUp", signUp);
router.post("/login", login);

router.post("/logout", logout)
router.get('/getAllUsers', getAllUsers);




module.exports = router;