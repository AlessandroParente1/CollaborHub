import './App.css';
import  Chat from './pages/Chat';
import axios from 'axios';
import React, { useState, useEffect } from 'react';
//import Login from './pages/Login';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
//import Signup from './pages/Signup';
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
        <>//Webstorm pensa che questo sia un file .jsx
            <CssBaseline />
            <Router>
                <Routes>
                    {/* <Route path="/" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />*/}
                    <Route path="/" element={<Chat />} /> {/* dopo che abbiamo finito di vedere la chat cambiamo l'endpoint a /chat*/}
                </Routes>
            </Router>
        </>
    );

}

export default App;
