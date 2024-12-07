const express = require("express");
const router = express.Router();
const {register, login, logout,getAllUsers} = require("../controllers/user.controller.js");
const verifyToken = require("../Middleware/verifyToken.js");

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/all",verifyToken,getAllUsers); //uno user non loggato non potrà accedere alla lista di tutti gli utenti



module.exports = router;