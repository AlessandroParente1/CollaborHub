import React, { useState, useEffect} from 'react';
import {Box, List, ListItem, ListItemText, Typography, Button, TextField} from '@mui/material';
import axios from 'axios';
import './SideBar.css';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

function Sidebar ({onSelectUser, loggedUser, users, handleSearch, socket}) {

    const [error, setError] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);

    // Funzione per fare il logout (chiamata al backend)
    const handleLogout = async () => {
        try {
            await axios.post('http://localhost:5000/api/user/logout');  // Chiamata al backend
            console.log('Logout effettuato');
            window.location.href = '/';
        } catch (err) {
            console.error('Errore durante il logout:', err);
        }
    };

    useEffect(() => {

        if (socket.current) {

            socket.current.emit("get-online-users");

            socket.current.on("update-online-users", (onlineUsers) => {
                console.log('Online users received:', onlineUsers);
                setOnlineUsers(onlineUsers);
            });

            return () => {
                if (socket.current) {
                    socket.current.off("update-online-users");
                }
            };
        }
    }, [socket.current]);

    return (
        <Box className={'sidebar'}>
            <Typography className="sidebar-title">
                Users
            </Typography>
            <TextField type="text" placeholder="Search users..." onChange={(e) => handleSearch(e.target.value)} variant="outlined" size="small" fullWidth style={{ marginBottom:'5'}}/>
            {error ? (
                <Typography color="error">{error}</Typography>
            ) : (
                <List className="user-list">
                    {users
                        .filter((user) => user._id !== loggedUser._id) // Filtra gli utenti per escludere l'utente corrente
                        .map((user) => (
                            <ListItem key={user._id} button onClick={() => onSelectUser(user)}  className="user-list-item">
                                <ListItemText primary={
                                    <>
                                        {
                                            user.avatar ? (<img src ={user.avatar} alt='' className="avatar-image"/>): (<AccountCircleIcon/>)
                                        }
                                        {user.username}
                                        {onlineUsers.includes(user._id) &&<span className="online-status"> Online</span>}
                                    </>
                                } className="user-list-item-text" />
                            </ListItem>
                        ))}
                </List>
            )}
            <Button onClick={handleLogout} className="logout-button">
                Logout
            </Button>
        </Box>
    );
}

export default Sidebar;