import React, {useState} from 'react';
import axios from 'axios';
import TextField from '@mui/material/TextField';
import {FormHelperText, Grid2, Typography, Paper, Button, Input} from '@mui/material';
import PersonAddIcon from '@mui/icons-material/AccountCircle';
import './SignUp.css';

function SignUp () {
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        email: '',
        username: '',
        password: ''
    })
    const [avatar, setAvatar] = useState('');
    const [showAvatarField, setShowAvatarField] = useState(false);


    const handleInput = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    }

    const handleAvatarInput = (e) => {
        setAvatar(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        data.append('email', formData.email);
        data.append('username', formData.username);
        data.append('password', formData.password);
        try {
            const response = await axios.post('https://collaborhub-backend.onrender.com/api/user/signUp', data, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.data.success) {
                setShowAvatarField(true);
                alert('Se vuoi usare un immagine come Avatar, inseriscila nel campo sottostante');
            } else {
                setError(response.data.message);
            }
            localStorage.setItem('user', JSON.stringify(response.data.user));
            console.log(response.data);
        } catch (err) {
            if (err.status === 400){
                setError(err.response.data.msg);
            }
        }
    }

    const handleAvatarUpload =async(e) => {
        e.preventDefault();
        const user = JSON.parse(localStorage.getItem('user'));
        const data = new FormData();
        data.append('image', avatar);
        data.append('userId', user._id); // Aggiungi il userId

        try {
            const response = await axios.post('https://collaborhub-backend.onrender.com/api/user/addAvatar', data,{
                headers: { "Content-Type": "multipart/form-data" },
            });
            console.log(response.data);
            if (response.data.success) {
                localStorage.setItem('user', JSON.stringify(response.data.user));
                console.log('response.data.user',response.data.user);
                window.location.href = '/home';
            } else {
                setError(response.data.message);
            }
        } catch (err) {
            if (err.response && err.response.status === 400) {
                setError(err.response.data.msg);
            } else {
                setError('Errore di rete o server non raggiungibile.');
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
                    {!showAvatarField &&(
                        <Button type ='submit' color ='primary' variant= 'contained' style ={{margin : '8 px 0'}} fullWidth>
                            Registrati
                        </Button>
                    )}
                </form>
                {showAvatarField && (
                    <form onSubmit={handleAvatarUpload}>
                        <Input type='file' inputProps={{accept: "image/png, image/gif, image/jpeg"}} onChange={ handleAvatarInput} multiple size='small'/>
                        <Button type="submit" color="primary" variant="contained" style={{ margin: '8px 0' }} fullWidth>
                            Aggiungi Avatar
                        </Button>
                    </form>
                )}
            </Paper>
        </Grid2>
    )
}
export default SignUp;