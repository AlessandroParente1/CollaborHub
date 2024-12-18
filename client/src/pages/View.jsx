import Sidebar from "../components/SideBar";
import Chat from "../components/Chat";
import React, {useState, useRef, useEffect} from "react";
import {io} from "socket.io-client";



function View ({userId})  {
    const [selectedUser, setSelectedUser] = useState(null);
    const socket=useRef(null);



    useEffect(()=>{
            socket.current = io('localhost:5000');
            socket.current.emit("add-user", userId);

    },[userId]);

    return (
        <div style={{display: 'grid', gridTemplateColumns: '25% 75%'}}>
            <Sidebar onSelectUser={setSelectedUser}/>
            <div style={{flex: 1, padding: 16}}>
                {selectedUser ? (
                    <Chat selectedUser={selectedUser} socket={socket} userId={userId}/>
                ) : (
                    <h2>Select a user to start chatting</h2>
                )}
            </div>
        </div>
    );
}


export default View;