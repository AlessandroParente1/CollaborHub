const Message = require("../models/message.model");

const getAllMessages = async (req, res) => {
    const {from, to}=req.body;

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
        const TransformedMessages = messages.map((message)=>{
            return{
                fromSelf:message.sender.toString() === from, // Se il mittente è l'utente attuale
                message: message.message.text, //estrae il campo text dall'oggetto message contenuto in message
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
            // users: [from, to],
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

module.exports= {getAllMessages, addMessage};