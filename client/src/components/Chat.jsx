import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import axios from 'axios';
import ChatInput from './ChatInput';
import './Chat.css';

function Chat({ selectedUser, userId, socket }) {
    let interval;
    const [messages, setMessages] = useState([]);

    const getAllMessages =async()=>{
        const res = await axios.get(`http://localhost:5000/api/message/getAllMessages`,{
            from :userId,
            to :selectedUser._id
        });

        console.log(res.data);
        setMessages(res.data);

    }

    // Gestione del polling
    useEffect(() => {
        if (selectedUser) {
            getAllMessages(); // Chiamata iniziale
            interval = setInterval(() => {
                getAllMessages();
            }, 50000000); // Polling ogni 5 secondi
        }
        return () => {
            clearInterval(interval); // Cleanup
        };
    }, [selectedUser]);

    const handleSend = async(msg) =>{

        await axios.post('http://localhost:5000/api/message/addMessage',{
            from : userId,
            to : selectedUser._id,
            message : msg
        });
        socket.current.emit("send-msg",{
            to : selectedUser._id,
            from : userId,
            message : msg
        });

        socket.current.emit("send-notification",{
            to : selectedUser._id,
            from : userId,
            message : msg
        });

        const updatedMessages = [...messages];
        updatedMessages.push({fromSelf : true, message : msg});
        setMessages(updatedMessages)
    }

    // Ricevi messaggi in tempo reale tramite socket
    useEffect(() => {
        if (socket.current) {
            socket.current.on('msg-recieve', (msg) => {
                setMessages((prev) => [...prev, { fromSelf: false, message: msg }]);
            });
        }

        return () => {
            if (socket.current) {
                socket.current.off('msg-recieve');
            }
        };
    }, [socket]);


    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <div >
                {messages.map((message, index) => (
                    <div key={index} className={`message ${message.fromSelf ? 'sent' : 'received'}`}>
                        <p>{message.message}</p>
                    </div>
                ))}
            </div>
            {selectedUser && (
                <Box sx={{ padding: 2, borderTop: '1px solid #ddd' }}>
                    <ChatInput sendMessage={handleSend} />
                </Box>
            )}
        </Box>
    )
}

export default Chat;