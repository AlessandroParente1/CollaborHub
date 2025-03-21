import React, { useState } from "react";
import { IoMdSend } from "react-icons/io";
import {MdOutlineEmojiEmotions } from "react-icons/md";
import Picker from "emoji-picker-react";
import {Box, TextField, IconButton, Input } from "@mui/material"
import { MdPhoto } from "react-icons/md";
import './ChatInput.css';

function ChatInput ({sendMessage, notifyTyping, notTyping, sendImage}) {

    const [message, setMessage] = useState('');
    const [image, setImage] = useState(null);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);

    const sendChat = (e)=>{
        e.preventDefault();
        if(message.length > 0){
            notTyping();
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

    return (
        <Box component="form" onSubmit={(e) => sendChat(e)} className='chat-input'>
            <IconButton onClick={() => setShowEmojiPicker(!showEmojiPicker)} sx={{position:'relative'}}>
                <MdOutlineEmojiEmotions />
            </IconButton>
            {showEmojiPicker &&
            <Box className="emoji-picker-container">
                {/*concateno l'emoji al messaggio di testo*/}
                <Picker onEmojiClick={(emojiObject)=> setMessage((prev)=> prev + emojiObject.emoji)} />
            </Box>}
            <TextField type="string"  value={message} onChange={(e) => {setMessage(e.target.value); handleTyping(e);}} placeholder="Message" fullWidth variant="outlined" sx={{marginRight: 1}}/>
            <IconButton onClick={() => document.getElementById('image-upload').click()} size='small'>
                <MdPhoto />
            </IconButton>
            <Input id="image-upload" type='file' accept="image/png, image/gif, image/jpeg" onChange={(e) => setImage(e.target.files[0])} sx={{ display: 'none' }} /> {/*Nasconde l'input visivamente */}
            <IconButton type="submit" color="primary">
                <IoMdSend />
            </IconButton>
        </Box>
    );
}

export default ChatInput;