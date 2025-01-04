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

    const getUser=async() =>{
        const user = await JSON.parse(localStorage.getItem("user"));
        setLoggedUser(user);
    }

    // Funzione per recuperare la lista degli utenti da mostrare nella SideBar
    const fetchUsers = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/user/getAllUsers');
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

    const enterChat = async (selectedUser) => {

        const loggedUser =await JSON.parse(localStorage.getItem("user"));

        try {
            await axios.post("http://localhost:5000/api/user/enterChat", {
                userId: loggedUser._id,
                ChatWithId:selectedUser._id,
            });
            console.log("Chat entered successfully");

        } catch (err) {
            console.error("Errore nell'entrare nella chat:", err);
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

    useEffect(() => {
        if (selectedUser) {
            enterChat(selectedUser);
        }
    }, [selectedUser]);


    return (
        <div className='view-container'>
            <Sidebar onSelectUser={setSelectedUser} users={filteredUsers} loggedUser={loggedUser} handleSearch={handleSearch}/>
            <div className='chat-wrapper'>
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