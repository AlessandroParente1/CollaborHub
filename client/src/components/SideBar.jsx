import React, { useState} from 'react';
import {Box, List, ListItem, ListItemText, Typography, Button, TextField} from '@mui/material';
import axios from 'axios';
import './SideBar.css';

function Sidebar ({onSelectUser, loggedUser, users, handleSearch}) {

    const [error, setError] = useState(null);

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

    return (
        <Box className={'sidebar'}>
            <Typography className="sidebar-title">
                Online Users
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
                                <ListItemText primary={user.username} className="user-list-item-text" />
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