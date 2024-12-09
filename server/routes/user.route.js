const express = require("express");
const router = express.Router();
const {register, login} = require("../controllers/user.controller.js");
const verifyToken = require("../Middleware/verifyToken.js");

router.post("/register", register);
router.post("/login", login);



module.exports = router;