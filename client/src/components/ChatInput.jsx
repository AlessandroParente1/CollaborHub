import React, { useState } from "react";
import { IoMdSend } from "react-icons/io";
import {Box, TextField, IconButton } from "@mui/material"

function ChatInput ({sendMessage, notifyTyping, notTyping}) {

    const [message, setMessage] = useState('');

    const sendChat = (e)=>{
        e.preventDefault();
        if(message.length > 0){
            sendMessage(message)
            setMessage("");
        }
    }

    const handleTyping = (e)=>{
        console.log(e.target.value);
        console.log(e.target.value.length);

        if(e.target.value.length > 0){
            notifyTyping();
        }
        else{
            notTyping();
        }
    }

    return (

        <Box component="form" onSubmit={(e) => sendChat(e)} sx={{
            display: "flex", alignItems: "center", position: "absolute", bottom: 0, left: 0, right: 0, padding: "8px"}}>
            <TextField type="string"  value={message} onChange={(e) => {setMessage(e.target.value); handleTyping(e);}} placeholder="Message" fullWidth variant="outlined" sx={{marginRight: 1}}/>
            <IconButton type="submit" color="primary">
                <IoMdSend />
            </IconButton>
        </Box>
    );
}

export default ChatInput;