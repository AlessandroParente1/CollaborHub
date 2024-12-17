import React, { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import axios from 'axios';
import MessageLeft from './MessageLeft';
import MessageRight from './MessageRight';
import ChatInput from './ChatInput';

function Chat({ selectedUser, userId }) {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [isSending, setIsSending] = useState(false);

    // Funzione per recuperare i messaggi
    const fetchMessages = async () => {
        if (selectedUser && userId) {
            try {
                const response = await axios.get('http://localhost:5000/api/message/getAllMessages', {
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

    useEffect(() => {
        fetchMessages();
    }, [selectedUser]);


    return (
        <Box sx={{marginLeft: '20vw', width: '80vw', height: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{flex: 1, overflowY: 'auto', padding: 2,  display: 'flex', flexDirection: 'column-reverse', marginTop: 2 }}>
                {loading ? (
                    <CircularProgress />
                ) : messages.length === 0 ? (
                    <Typography>No messages yet.</Typography>
                ) : (
                    <Box>
                        {messages.map((msg, index) =>
                            msg.fromSelf ? (
                                <MessageRight key={index} message={msg.message} />
                            ) : (
                                <MessageLeft key={index} message={msg.message} />
                            )
                        )}
                    </Box>
                )}
            </Box>
            <Box  sx={{padding: 2, borderTop: '1px solid #ddd', backgroundColor: '#f9f9f9', display: 'flex',  gap: 2 }}>
                {selectedUser && (
                    <ChatInput recipient={selectedUser._id} sender={userId} />
                )}
            </Box>
        </Box>
    );
}

export default Chat;
