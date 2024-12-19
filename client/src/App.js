import './App.css';
import  View from './pages/View';
import React, { useState } from 'react';
import Login from './pages/Login';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignUp from './pages/SignUp';
import CssBaseline from '@mui/material/CssBaseline';


function App() {
    const [userId, setUserId] = useState(null);

    return (
        <>
            <CssBaseline />
            <Router>
                <Routes>
                    <Route path="/" element={<Login setUserId={setUserId} />} />
                    <Route path="/signup" element={<SignUp setUserId={setUserId}/>} />
                    <Route path="/home" element={<View userId={userId}/>} />
                </Routes>
            </Router>
        </>
    );

}

export default App;
