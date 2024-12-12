import  { TextField, Button , Box}  from "@mui/material";
import React from "react";
import { useState } from "react";
import  axios from 'axios';


function ChatInput () {

    const [message, setMessage] = useState('');
    const [isSending, setIsSending] = useState(false);

    // Funzione per inviare il messaggio
    const sendMessage = async () => {
        if (!message.trim()) {
            alert('Il messaggio non può essere vuoto.');
            return;
        }

        setIsSending(true);
        try {
            const response = await axios.post('/chat/messages', { message });
            console.log('Messaggio inviato:', response.data);
            setMessage(''); // Resetta la casella di testo dopo l'invio
        } catch (error) {
            console.error('Errore durante l invio del messaggio:', error);
        } finally {
            setIsSending(false);
        }
    };


    return (

        <Box
            sx={{
                position: 'fixed',
                bottom: 0,
                right: 0,
                width: '80%', //4/5 della larghezza della finestra
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                padding: 2,
                borderTop: '1px solid #ddd',
                backgroundColor: '#f9f9f9',
            }}
        >
            <TextField
                label="Scrivi un messaggio"
                variant="outlined"
                value={message}
                sx={{
                    width: '100%',
                    maxWidth: '600px',

                }}
                onChange={(e) => setMessage(e.target.value)}
                onKeyUp={(e) => {
                    if (e.key === 'Enter' && !isSending) {
                        sendMessage();
                    }
                }}
                disabled={isSending}
            />
            <Button
                variant="contained"
                color="primary"
                onClick={sendMessage}
                disabled={isSending}
            >
                {isSending ? 'Invio...' : 'Invia'}
            </Button>
        </Box>
    );
}

export default ChatInput;