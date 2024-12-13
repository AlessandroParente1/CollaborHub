const {addMessage, getAllMessages} = require('../controllers/message.controller.js');
const express = require('express');
const router = express.Router();
const verifyToken = require("../Middleware/verifyToken.js");

router.post('/addMessage',verifyToken, addMessage);
router.post('/getAllMessages',verifyToken, getAllMessages);

module.exports = router;