import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import axios from 'axios';
import ChatInput from './ChatInput';
import './Chat.css';

function Chat({ selectedUser, socket }) {

    const [messages, setMessages] = useState([]);

    const getAllMessages =async()=>{

        const loggedUser =await JSON.parse(localStorage.getItem("user"));

        const res = await axios.get(
            `http://localhost:5000/api/message/getAllMessages?from=${loggedUser._id}&to=${selectedUser._id}`,{});

        console.log(res.data);
        setMessages(res.data);

    }
    //recupera i messaggi di ogni chat a seconda di quale user hai cliccato nella SideBar
    useEffect(() => {
        if (selectedUser) {
            console.log('Fetching messages for user', selectedUser);
            getAllMessages();
        }
    }, [selectedUser]);

    const handleSend = async(msg) =>{

        const loggedUser =await JSON.parse(localStorage.getItem("user"));

        await axios.post('http://localhost:5000/api/message/addMessage',{
            from : loggedUser._id,
            to : selectedUser._id,
            message : msg
        });
        socket.current.emit("send-msg",{
            to : selectedUser._id,
            from : loggedUser._id,
            message : msg
        });

        socket.current.emit("send-notification",{
            to : selectedUser._id,
            from : loggedUser._id,
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