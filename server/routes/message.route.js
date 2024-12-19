const {addMessage, getAllMessages} = require('../controllers/message.controller.js');
const express = require('express');
const router = express.Router();
const verifyToken = require("../Middleware/verifyToken.js");

router.post('/addMessage', addMessage);
router.get('/getAllMessages', getAllMessages);

module.exports = router;