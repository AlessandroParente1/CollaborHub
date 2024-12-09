const express = require("express");
const router = express.Router();
const verify = require("../controllers/verify.controller.js");
const verifyToken = require('../middleware/verifyToken.js');

router.use(verifyToken);

router.get("/",verify);

module.exports = router;