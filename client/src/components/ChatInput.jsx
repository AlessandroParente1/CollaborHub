import React, { useState } from "react";
import { IoMdSend } from "react-icons/io";

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

        <form onSubmit={(e) => sendChat(e)} className="input-container">

            <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder='Message'
            />
            <button type='submit'>
                <IoMdSend/>
            </button>
        </form>
    );
}

export default ChatInput;