import Sidebar from "../components/SideBar";
import Chat from "../components/Chat";
import React, {useState, useRef, useEffect} from "react";
import {useNavigate} from "react-router-dom";
import {io} from "socket.io-client";
import axios from "axios";
import './View.css'

function View ()  {
    const navigate = useNavigate();
    const [loggedUser, setLoggedUser] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);
    const socket=useRef(null);
    const [users, setUsers] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    //console.log('selectedUser',selectedUser);

    const getUser=async() =>{
        const user = await JSON.parse(localStorage.getItem("user"));
        setLoggedUser(user);
    }

    // Funzione per recuperare la lista degli utenti da mostrare nella SideBar
    const fetchUsers = async () => {
        try {
            const response = await axios.get('https://collaborhub-backend.onrender.com/api/user/getAllUsers');
            setUsers(response.data.users);
        } catch (err) {
            console.error('Errore durante il recupero degli utenti:', err);
        }

    };

    // Funzione per effettuare la ricerca degli utenti, sotto c'è quella per filtrare gli utenti
    const handleSearch = (query) => {
        setSearchQuery(query.toLowerCase());
    };

    const filteredUsers = users.filter((user) =>
        user.username.toLowerCase().includes(searchQuery)
    );

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
            socket.current = io('https://collaborhub-backend.onrender.com');
            socket.current.emit("add-user", loggedUser._id);
        }

    },[loggedUser]);

    useEffect(()=>{
        if(loggedUser) {
            fetchUsers()
        }},[loggedUser])


    return (
        <div className='view-container'>
            <Sidebar onSelectUser={setSelectedUser} users={filteredUsers} loggedUser={loggedUser} handleSearch={handleSearch} socket={socket}/>
            <div className='chat-wrapper'>
                {selectedUser ? (
                    <Chat selectedUser={selectedUser} socket={socket} />
                ) : (
                    <h2 className="centered-text">Select a user to start chatting</h2>
                )}
            </div>
        </div>
    );
}


export default View;