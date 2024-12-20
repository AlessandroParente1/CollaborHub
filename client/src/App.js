import './App.css';
import  View from './pages/View';
import Login from './pages/Login';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignUp from './pages/SignUp';
import CssBaseline from '@mui/material/CssBaseline';
import axios from 'axios';

axios.defaults.withCredentials=true;
axios.defaults.headers.common['Content-Type'] = 'application/json';

function App() {

    return (
        <>
            <CssBaseline />
            <Router>
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/signup" element={<SignUp />} />
                    <Route path="/home" element={<View />} />
                </Routes>
            </Router>
        </>
    );

}

export default App;
