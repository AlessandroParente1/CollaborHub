const Message = require("../models/message.model");
require("dotenv").config();
const cloudinary = require("../config/cloudinaryConfig");

const getAllMessages = async (req, res) => {

    const {from, to}=req.query;

    try {
        const messages = await Message.find(
            //cerco i messaggi scambiati tra i 2 utenti
            {
                $or: [
                    { sender: from, receiver: to },//Sono stati inviati da from a to
                    { sender: to, receiver: from },//Sono stati inviati da to a from
                ],
            }
        ).sort({updatedAt: 1});//ordine crescente

        /*output della query:

        {
            _id: "64b9f0e0c9e77b2a44712abc", // ID univoco del messaggio
            sender: "userid123",            // ID dell'utente che ha inviato il messaggio
            receiver: "userid456",          // ID dell'utente che ha ricevuto il messaggio
            message: {
            text: "Hello, how are you?"   // Testo del messaggio
        },
            createdAt: "2024-12-13T10:00:00Z", // Data di creazione del messaggio
            updatedAt: "2024-12-13T10:01:00Z"  // Data dell'ultimo aggiornamento
        }

         */
        //Nota 1
        const TransformedMessages = messages.map((msg)=>{
            return{
                fromSelf:msg.sender.toString() === from, // Se il mittente è l'utente attuale
                message: msg.message, //estrae il campo text dall'oggetto message contenuto in message
                image: msg.image,
            }

        })

        //restituisce al client l'array di oggetti messaggi con due proprietà
        res.status(200).json(TransformedMessages);

    } catch (error) {
        console.error('Errore nel recupero dei messaggi:', error);
        res.status(500).json({
            success: false,
            message: 'Errore nel recupero dei messaggi',
        });
    }
};

const addMessage = async (req, res) => {
    try {
        const { from, to, message } = req.body;
        const data = await Message.create({
            message: message,
            sender: from,
            receiver: to,
        },{});

        if (data) return res.json({ msg: "Message added successfully." });
        else return res.json({ msg: "Failed to add message to the database" });
    } catch (error) {
        console.log(error);
        return res.json({ msg: "Failed to add message to the database" });
    }
}


const addImage= async(req, res)=>{
    try {

        const { from, to } = req.body;

        //Conversione dell'immagine in formato Base64
        const b64 = Buffer.from(req.file.buffer).toString("base64");
        let dataURI = "data:" + req.file.mimetype + ";base64," + b64;
        //Upload dell'immagine su cloudinary
        const cldRes = await handleUpload(dataURI);

        //console.log("Image uploaded to Cloudinary:", cldRes.secure_url);


        // Creazione del messaggio con l'immagine
        const newMessage = await Message.create({
            sender: from,
            receiver: to,
            image: cldRes.secure_url,
        });

        res.status(200).json({ message: "Image sent successfully", data: newMessage });
    }
    catch (error) {
        console.log(error);
        res.send({message: error.message,});
    }
}

const handleUpload = async (file)=>{
    const res = await cloudinary.uploader.upload(file, {
        resource_type: "auto", //permette a cloudinary di rilevare automaticamente il tipo di file
    });
    return res;
}


module.exports= {getAllMessages, addMessage, addImage};