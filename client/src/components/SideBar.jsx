import React, { useState} from 'react';
import {Box, List, ListItem, ListItemText, Typography, Button, TextField} from '@mui/material';
import axios from 'axios';

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
        <Box sx={{ position: 'relative', height: '100vh', padding: 2 }}>
            <Typography variant="h6" sx={{ marginBottom: 2 }}>
                Online Users
            </Typography>
            <TextField type="text" placeholder="Search users..." onChange={(e) => handleSearch(e.target.value)} variant="outlined" size="small" fullWidth style={{ marginBottom:'2'}}/>
            {error ? (
                <Typography color="error">{error}</Typography>
            ) : (
                <List>
                    {users
                        .filter((user) => user._id !== loggedUser._id) // Filtra gli utenti per escludere l'utente corrente
                        .map((user) => (
                            <ListItem key={user._id} button onClick={() => onSelectUser(user)}>
                                <ListItemText primary={user.username} />
                            </ListItem>
                        ))}
                </List>
            )}
            <Button onClick={handleLogout} sx={{position: 'absolute',bottom: 20,left: '50%',transform: 'translateX(-50%)',}} variant="contained" color="secondary">
                Logout
            </Button>
        </Box>
    );
}

export default Sidebar;