import {useState} from 'react';
import axios from 'axios';
import TextField from '@mui/material/TextField';
import { FormHelperText, Grid2, Typography, Paper, Button } from '@mui/material';
import PersonAddIcon from '@mui/icons-material/AccountCircle';
import './SignUp.css';

function SignUp () {
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        email: '',
        username: '',
        password: ''
    })


    const handleInput = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        data.append('email', formData.email);
        data.append('username', formData.username);
        data.append('password', formData.password);
        try {
            const response = await axios.post('http://localhost:5000/api/user/signUp', data, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            localStorage.setItem('user', JSON.stringify(response.data.user));
            window.location.href = '/home'
            console.log(response.data);
        } catch (err) {
            if (err.status === 400){
                setError(err.response.data.msg);
            }
        }
    }
    return (
        <Grid2 container direction="column" justifyContent="center" alignItems="center" style={{ minHeight: '100vh' }}>
            <Paper style ={{padding:'30 px 15 px', width: 350, margin: "20 px auto"}}>
                <Grid2 align="center">
                    <PersonAddIcon/>
                    <Typography variant="h4" gutterBottom>
                        Registrazione
                    </Typography>
                    <Typography variant ="caption">
                        Compila il seguente form per registrarti
                    </Typography>
                </Grid2>
                <form onSubmit={handleSubmit}>
                    <TextField fullWidth label='Email' name='email' placeholder='Inserisci email' type ='email' value={formData.email} required onChange={handleInput}/>
                    <TextField fullWidth label='Username' name='username' placeholder='Inserisci username' value={formData.username} required onChange={handleInput}/>
                    <TextField fullWidth label='Password' name='password' placeholder='Inserisci password' type ='password' value={formData.password} required onChange={handleInput}/>
                    {error && (<FormHelperText sx={{ color: 'red' }}>{error}</FormHelperText>)}
                    <Button type="submit" variant="contained" color ="primary" fullWidth>
                        Registrati
                    </Button>
                </form>
            </Paper>
        </Grid2>
    )
}
export default SignUp;