import Sidebar from "../components/SideBar";
import Chat from "../components/Chat";
import React, {useState, useRef, useEffect} from "react";
import {useNavigate} from "react-router-dom";
import {io} from "socket.io-client";
import axios from "axios";

function View ()  {
    const navigate = useNavigate();
    const [loggedUser, setLoggedUser] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);
    const socket=useRef(null);
    const [users, setUsers] = useState([]);

    const getUser=async() =>{
        const user = await JSON.parse(localStorage.getItem("user"));
        setLoggedUser(user);
    }

    // Funzione per recuperare la lista degli utenti per usare nella SideBar
    const fetchUsers = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/user/getAllUsers');
            setUsers(response.data.users);
        } catch (err) {
            console.error('Errore durante il recupero degli utenti:', err);
        }

    };

    useEffect(()=>{
        if(!JSON.parse(localStorage.getItem("user")) ){
            navigate('/');
        }
        else {
            getUser();
        }
    }, [])

    useEffect(()=>{
        if(loggedUser) {
            socket.current = io('localhost:5000');
            socket.current.emit("add-user", loggedUser._id);
        }

    },[loggedUser]);

    useEffect(()=>{
        if(loggedUser) {
            fetchUsers()
        }},[loggedUser])


    return (
        <div style={{display: 'grid', gridTemplateColumns: '25% 75%', height: '100vh'}}>
            <Sidebar onSelectUser={setSelectedUser} users={users} loggedUser={loggedUser} />
            <div style={{flex: 1, padding: 16,  position: 'relative', display: 'flex', flexDirection: 'column'}}>
                {selectedUser ? (
                    <Chat selectedUser={selectedUser} socket={socket} />
                ) : (
                    <h2>Select a user to start chatting</h2>
                )}
            </div>
        </div>
    );
}


export default View;