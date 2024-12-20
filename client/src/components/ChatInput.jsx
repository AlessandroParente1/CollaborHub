import React, { useState } from "react";
import { IoMdSend } from "react-icons/io";
import {Box, TextField, IconButton } from "@mui/material"

function ChatInput ({sendMessage}) {

    const [message, setMessage] = useState('');

    const sendChat = (e)=>{
        e.preventDefault();
        if(message.length > 0){
            sendMessage(message)
            setMessage("");
        }
    }

    return (

        <Box component="form" onSubmit={(e) => sendChat(e)} sx={{
            display: "flex", alignItems: "center", position: "absolute", bottom: 0, left: 0, right: 0, padding: "8px"}}>
            <TextField type="string"  value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Message" fullWidth variant="outlined" sx={{marginRight: 1}}/>
            <IconButton type="submit" color="primary">
                <IoMdSend />
            </IconButton>
        </Box>
    );
}

export default ChatInput;