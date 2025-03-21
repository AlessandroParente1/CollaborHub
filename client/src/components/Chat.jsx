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
            `https://collaborhub-backend.onrender.com/api/message/getAllMessages?from=${loggedUser._id}&to=${selectedUser._id}`,{});

        //console.log(res.data);
        setMessages(res.data);

    }
    //recupera i messaggi di ogni chat a seconda di quale user hai cliccato nella SideBar
    useEffect(() => {
        if (selectedUser) {
            //console.log('Fetching messages for user', selectedUser);
            getAllMessages();
        }
    }, [selectedUser]);

    const handleSend = async(msg) =>{

        const loggedUser =await JSON.parse(localStorage.getItem("user"));

        await axios.post('https://collaborhub-backend.onrender.com/api/message/addMessage',{
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
            fromId: loggedUser._id,
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
            const res = await axios.post('https://collaborhub-backend.onrender.com/api/message/addImage', formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            // Recupera l'URL dell'immagine dal backend (destructuring)
            const { data: { data: savedMessage } } = res; //Alternativa const savedMessage = response.data.data;
            //console.log(res);

            //console.log('savedMessage:', savedMessage);
            //console.log('savedMessage.image:', savedMessage.image);

            socket.current.emit("send-image",{
                to : selectedUser._id,
                from : loggedUser._id,
                //invio l'url dell'immagine su cloudinary
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
            socket.current.on('msg-receive', (data) => {
                //Nota 3
                // Aggiungi un controllo per standardizzare il formato del messaggio
                setMessages((prev) => [
                    ...prev,
                    {
                        fromSelf: false,
                        message: data.message.message || data.message, // Accetta sia oggetti che stringhe
                        //se data.message.to esiste, aggiunge la proprietà to all'oggetto del messaggio
                        ...(data.message.to && { to: data.message.to }),
                        ...(data.message.from && { from: data.message.from }),
                    },
                ]);
            });

            socket.current.on('img-receive', (data) => {
                //console.log('immagine ricevuta:', data.image);
                //console.log("Data dell'immagine ricevuta:", data);

                //quando Ricevo un immagine da un utente lo aggiungi alla lista
                setMessages((prev) => [...prev, { fromSelf: false, image: data.image }]);
            });

            socket.current.on("user-typing-receive", (data) => {
                if(data.from === selectedUser._id) {
                    setIsTyping(true);
                }
            })

            socket.current.on("user-stopped-typing-receive", () => {
                    setIsTyping(false);

            })

            socket.current.on('notification-receive',(data)=>{
                //console.log('data.fromId',data.fromId);
                //console.log('selectedUser._id',selectedUser._id);
                //console.log('selectedUser.username',selectedUser.username);
                //console.log('data.from',data.from);
                if(selectedUser && data.fromId !== selectedUser._id){
                    alert(`${data.from} ti ha inviato un messaggio`);

                }

            })

        }

        return () => {
            if (socket.current) {
                //Quando l'evento msg-receive viene emesso, non voglio più che questa funzione venga chiamata (smettila di ascoltare)
                socket.current.off('msg-receive');
                socket.current.off('img-receive');
                socket.current.off("user-typing-receive");
                socket.current.off("user-stopped-typing-receive");
                socket.current.off('remove-user-receive');
                socket.current.off('notification-receive');
            }
        };
    }, [socket, selectedUser]);


    //console.log('messaggi',messages);
    return (
        <Box className='chat-container'>
            {/*nome utente con cui si sta chattando*/}
            {selectedUser && (
                <Box sx={{ padding: 2, borderBottom: '1px solid #ddd', backgroundColor: '#9A9EBB', textAlign: 'center', color:'white'}}>
                    <Typography variant="h6">{selectedUser.username}</Typography>
                </Box>
            )}
            {/* Contenitore dei messaggi */}
            <div className="chat-messages">
                {messages.map((message, index) => (
                    <div key={index} className={`message ${message.fromSelf ? 'sent' : 'received'}`}>
                        {message.image ? (
                            <img src={message.image} alt="Sent image" style={{ maxWidth: "200px", borderRadius: "8px" }} />
                        ) :  (
                            <p>{message.message}</p>
                        )}
                    </div>
                ))}
                {renderTypingMessage()}
            </div>
            {/* Barra di input */}
            {selectedUser && (

                <ChatInput sendMessage={handleSend} notifyTyping={notifyTyping} notTyping={notTyping} sendImage={sendImage}/>

            )}
        </Box>
    )
}

export default Chat;