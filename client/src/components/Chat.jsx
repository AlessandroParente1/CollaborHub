import React, { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import axios from 'axios';
import ChatInput from './ChatInput';
import { io } from 'socket.io-client';
import './Chat.css';

function Chat({ selectedUser, userId }) {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);

    // Connessione al server Socket.io
    const socket = io("http://localhost:5000", {
        withCredentials: true,
    });

    useEffect(() => {
        // Aggiungi l'utente agli onlineUsers quando si connette
        socket.emit("add-user", userId);

        // Funzione per recuperare i messaggi iniziali
        const fetchMessages = async () => {
            if (selectedUser && userId) {
                try {
                    const response = await axios.post('http://localhost:5000/api/message/getAllMessages', {
                        from: userId,
                        to: selectedUser._id,
                    });
                    setMessages(response.data);
                    setLoading(false);
                } catch (err) {
                    console.error('Errore nel recupero dei messaggi:', err);
                    setLoading(false);
                }
            }
        };

        fetchMessages();

        // Ascolta i nuovi messaggi in arrivo
        socket.on("msg-recieve", (newMessage) => {
            setMessages((prevMessages) => [...prevMessages, newMessage]);
        });

        return () => {
            socket.disconnect();  // Disconnessione quando il componente viene smontato
        };
    }, [selectedUser, userId, socket]);


    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            {/* Corpo della chat */}
            <Box
                sx={{
                    flex: 1,
                    overflowY: 'auto',
                    padding: 2,
                    backgroundColor: '#f5f5f5',
                }}
            >
                {loading ? (
                    <CircularProgress />
                ) : messages.length === 0 ? (
                    <Typography>Nessun messaggio ancora.</Typography>
                ) : (
                    messages.map((msg, index) => (
                        <Box
                            key={index}
                            className={msg.fromSelf ? 'sent' : 'received'}
                        >
                            {msg.message}
                        </Box>
                    ))
                )}
            </Box>

            {/* Componente di input per l'invio dei messaggi */}
            {selectedUser && (
                <Box sx={{ padding: 2, borderTop: '1px solid #ddd' }}>
                    <ChatInput
                        recipient={selectedUser._id}
                        sender={userId}
                        socket={socket}
                    />
                </Box>
            )}
        </Box>
    )
}

export default Chat;