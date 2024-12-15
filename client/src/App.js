import './App.css';
import  Chat from './pages/Chat';
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import Login from './pages/Login';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignUp from './pages/SignUp';
import CssBaseline from '@mui/material/CssBaseline';

axios.defaults.withCredentials = true;
axios.defaults.headers.common['Content-Type'] = 'application/json';

function App() {

    const [message, setMessage] = useState('');

    useEffect(() => {
        // Recuperiamo i dati dal server
        axios.get('http://localhost:5000/')
            .then(response => setMessage(response.data))
            .catch(error => console.error('errore: ' + error));
    }, []);


    return (
        <>
            <CssBaseline />
            <Router>
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/signup" element={<SignUp />} />
                    <Route path="/home" element={<Chat />} /> {/* dopo che abbiamo finito di vedere la chat cambiamo l'endpoint a /chat*/}
                </Routes>
            </Router>
        </>
    );

}

export default App;
