import React, { useState } from "react";
import { IoMdSend } from "react-icons/io";
import {MdOutlineEmojiEmotions } from "react-icons/md";
import Picker from "emoji-picker-react";
import {Box, TextField, IconButton, Input } from "@mui/material"

function ChatInput ({sendMessage, notifyTyping, notTyping, sendImage}) {

    const [message, setMessage] = useState('');
    const [image, setImage] = useState(null);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);

    const sendChat = (e)=>{
        e.preventDefault();
        if(message.length > 0){
            sendMessage(message)
            setMessage("");
        }
        if(image){
            sendImage(image);
            setImage(null);
        }
    }

    const handleTyping = (e)=>{

        if(e.target.value.length > 0){
            notifyTyping();
        }
        else{
            notTyping();
        }
    }
    //Nota 3
    return (

        <Box component="form" onSubmit={(e) => sendChat(e)} sx={{display: "flex", alignItems: "center", position: "absolute", bottom: 0, left: 0, right: 0, padding: "8px"}}>
            <IconButton onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
                <MdOutlineEmojiEmotions />
            </IconButton>
            {showEmojiPicker &&                                                       //concateno l'emoji al messaggio di testo
                <Picker onEmojiClick={(emojiObject)=> setMessage((prev)=> prev + emojiObject.emoji)} />}
            <TextField type="string"  value={message} onChange={(e) => {setMessage(e.target.value); handleTyping(e);}} placeholder="Message" fullWidth variant="outlined" sx={{marginRight: 1}}/>
            <Input type='file' inputProps={{accept: "image/png, image/gif, image/jpeg"}} onChange={(e) =>{ setImage(e.target.files[0])}} multiple size='small'/>
            <IconButton type="submit" color="primary">
                <IoMdSend />
            </IconButton>
        </Box>
    );
}

export default ChatInput;