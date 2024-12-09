import React, { useState, useEffect } from "react";
import { TextField, Button, List, ListItem, ListItemText, Typography } from "@mui/material";
import axios from "axios";
import { useParams } from "react-router-dom";
//finestra dove si trova la chat vera e proprio con uno user
const ChatWindow = () => {
    const { userId } = useParams();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const response = await axios.get(`/api/chat/messages/${userId}`, {
                    withCredentials: true,
                });
                setMessages(response.data.messages);
            } catch (error) {
                console.error("Error fetching messages", error);
            }
        };

        fetchMessages();
    }, [userId]);

    const handleSendMessage = async () => {
        try {
            const response = await axios.post(
                `/api/chat/messages/${userId}`,
                { message: newMessage },
                { withCredentials: true }
            );
            setMessages([...messages, response.data.message]);
            setNewMessage("");
        } catch (error) {
            console.error("Error sending message", error);
        }
    };

    return (
        <div>
            <Typography variant="h5">Chat with User</Typography>
            <List>
                {messages.map((msg, index) => (
                    <ListItem key={index}>
                        <ListItemText primary={msg.content} />
                    </ListItem>
                ))}
            </List>
            <TextField
                fullWidth
                label="Type a message"
                variant="outlined"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            />
            <Button onClick={handleSendMessage} variant="contained" color="primary" fullWidth>
                Send
            </Button>
        </div>
    );
};

export default ChatWindow;
