// Importazioni necessarie
import React, { useState, useEffect } from 'react';
import { Box, List, ListItem, ListItemText, CircularProgress, Typography } from '@mui/material';
import axios from 'axios';

const Sidebar = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Funzione per recuperare la lista degli utenti
    const fetchUsers = async () => {
        try {
            const response = await axios.get('/user/getAllUsers');
            setUsers(response.data.users); // Supponendo che la risposta abbia un campo "users"
            setLoading(false);
        } catch (err) {
            console.error('Errore durante il recupero degli utenti:', err);
            setError('Impossibile caricare gli utenti.');
            setLoading(false);
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
                width: '20%', // 1/5 della larghezza della finestra
                height: '100%',
                borderRight: '1px solid #ddd',
                backgroundColor: '#f4f4f4',
                overflowY: 'auto',
                padding: 2,
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
                        <ListItem key={user.id} button>
                            <ListItemText primary={user.name} />
                        </ListItem>
                    ))}
                </List>
            )}
        </Box>
    );
};

export default Sidebar;
