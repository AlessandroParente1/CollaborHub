import React, { useState, useEffect } from 'react';
import {Box, Typography} from '@mui/material';
import axios from 'axios';
import ChatInput from './ChatInput';
import './Chat.css';

function Chat({ selectedUser, socket }) {

    const [messages, setMessages] = useState([]);
    const [isTyping, setIsTyping] = useState(false);

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
            from : loggedUser.username,
            message : msg
        });

        //quando Mando un messaggio da un utente lo aggiungi alla lista
        const updatedMessages = [...messages];
        updatedMessages.push({fromSelf : true, message : msg});
        setMessages(updatedMessages)
    }

    const sendImage= async(img)=>{

        const loggedUser = JSON.parse(localStorage.getItem("user"));

        //Uso formData perchè gestisce automaticamente i dati binari (immagini)
        const formData = new FormData();
        formData.append("image", img);
        formData.append("from", loggedUser._id);
        formData.append("to", selectedUser._id);

        try {
            const res = await axios.post('http://localhost:5000/api/message/addImage', formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            // Recupera l'URL dell'immagine dal backend
            const { data: { data: savedMessage } } = res; //Alternativa const savedMessage = response.data.data;

            socket.current.emit("send-image",{
                to : selectedUser._id,
                from : loggedUser._id,
                //invio l'url dell'immagine da cloudinary
                image : savedMessage.image,
            });

            const updatedMessages = [...messages];
            updatedMessages.push({fromSelf: true, image: savedMessage.image});
            setMessages(updatedMessages);

        } catch (error) {
            console.error("Error sending image:", error);
        }
    }

    //funzionalità Sta scrivendo... (3 funzioni sotto)
    const notifyTyping = async() => {
        const loggedUser =await JSON.parse(localStorage.getItem("user"));

        socket.current.emit("user-typing",{
            to : selectedUser._id,
            from : loggedUser._id
        });
    }

    const notTyping = async() => {
        const loggedUser =await JSON.parse(localStorage.getItem("user"));

        socket.current.emit("user-stopped-typing",{
            to : selectedUser._id,
            from : loggedUser._id
        });
    }

    const renderTypingMessage = () => {
        if (isTyping === true) {
            return <p className='typing-message'>Sta scrivendo...</p>;
        }
        return null;
    };


    // Ricevi eventi in tempo reale tramite socket
    useEffect(() => {
        if (socket.current) {
            socket.current.on('msg-receive', (msg) => {
                //quando Ricevo un messaggio da un utente lo aggiungi alla lista
                setMessages((prev) => [...prev, { fromSelf: false, message: msg }]);
            });

            socket.current.on('img-receive', (data) => {
                //quando Ricevo un immagine da un utente lo aggiungi alla lista
                setMessages((prev) => [...prev, { fromSelf: false, image: data.image }]);
            });

            socket.current.on('notification-receive',(from)=>{
                console.log(from);
                alert(`${from} ti ha inviato un messaggio`);

            })

            socket.current.on("user-typing-receive", () => {
                setIsTyping(true);
            })

            socket.current.on("user-stopped-typing-receive", () => {
                setIsTyping(false);
            })

        }

        return () => {
            if (socket.current) {
                //Quando l'evento msg-receive viene emesso, non voglio più che questa funzione venga chiamata (smettila di ascoltare)
                socket.current.off('msg-receive');
                socket.current.off('img-receive');
                socket.current.off("user-typing");
                socket.current.off("notification-receive");
                socket.current.off("user-stopped-typing");
            }
        };
    }, [socket]);

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            {/*nome utente con cui si sta chattando*/}
            {selectedUser && (
                <Box sx={{ padding: 2, borderBottom: '1px solid #ddd', backgroundColor: '#f5f5f5', textAlign: 'center'}}>
                    <Typography variant="h6">{selectedUser.username}</Typography>
                </Box>
            )}
            <div >
                {messages.map((message, index) => (
                    <div key={index} className={`message ${message.fromSelf ? 'sent' : 'received'}`}>
                        {message.image ? (
                            <img src={message.image} alt="Sent image" style={{ maxWidth: "200px", borderRadius: "8px" }} />
                        ) : (
                            <p>{message.message}</p>
                        )}
                    </div>
                ))}
                {renderTypingMessage()}
            </div>
            {selectedUser && (
                <Box sx={{ padding: 2, borderTop: '1px solid #ddd' }}>
                    <ChatInput sendMessage={handleSend} notifyTyping={notifyTyping} notTyping={notTyping} sendImage={sendImage}/>
                </Box>
            )}
        </Box>
    )
}

export default Chat;