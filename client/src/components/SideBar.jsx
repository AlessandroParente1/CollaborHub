// Importazioni necessarie
import React, { useState, useEffect } from 'react';
import {Box, List, ListItem, ListItemText, CircularProgress, Typography, Button} from '@mui/material';
import axios from 'axios';

function Sidebar ({onSelectUser}) {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Funzione per recuperare la lista degli utenti
    const fetchUsers = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/user/getAllUsers');
            setUsers(response.data.users);
            setLoading(false);
        } catch (err) {
            console.error('Errore durante il recupero degli utenti:', err);
            setError('Impossibile caricare gli utenti.');
            setLoading(false);
        }
    };

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

    // Effetto per chiamare l'API quando il componente viene montato
    useEffect(() => {
        fetchUsers();
    }, []);

    return (
        <Box
            sx={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '20vw', // 1/5 della larghezza della finestra
                height: '100vh',//occupa tutta l'altezza
                borderRight: '1px solid #ddd',
                backgroundColor: '#f4f4f4',
                overflowY: 'auto',
                padding: 2,
                justifyContent:'space-between'
            }}
        >
            <Typography variant="h6" sx={{ marginBottom: 2 }}>
                Utenti Online
            </Typography>
            {loading ? (
                <CircularProgress />
            ) : error ? (
                <Typography color="error">{error}</Typography>
            ) : (
                <List>
                    {users.map((user) => (
                        <ListItem key={user._id} button onClick={() => onSelectUser(user)}>
                            <ListItemText primary={user.username} />
                        </ListItem>
                    ))}
                </List>
            )}

        <Button
                onClick={handleLogout}
                sx={{
                    position: 'absolute',
                    bottom: 20,  // Posiziona il pulsante in basso
                    left: '50%',
                    transform: 'translateX(-50%)',  // Centra il pulsante orizzontalmente

                }}
                variant="contained"
                color="secondary"
            >
            Logout
        </Button>

        </Box>


    );
}

export default Sidebar;
