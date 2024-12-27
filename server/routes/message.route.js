const {addMessage, getAllMessages, addImage} = require('../controllers/message.controller.js');
const express = require('express');
const router = express.Router();
const verifyToken = require("../Middleware/verifyToken.js");

//per caricare le immagini
const Multer = require("multer");
const storage = new Multer.memoryStorage();
const upload = Multer({storage});


router.post('/addMessage',verifyToken, addMessage);
router.get('/getAllMessages',verifyToken, getAllMessages);
router.post('/addImage', verifyToken, upload.single("image"), addImage);

module.exports = router;