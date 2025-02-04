import {useState} from 'react';
import axios from 'axios';
import TextField from '@mui/material/TextField';
import { FormHelperText, Grid2, Typography, Paper, Button  } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import './Login.css';

function Login() {
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    })
    const [otp, setOtp] = useState('');
    const [showOtpField, setShowOtpField] = useState(false);

    const handleInput = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    }

    const handleOtpInput = (e) => {
        setOtp(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        data.append('username', formData.username);
        data.append('password', formData.password);
        try {
            const response = await axios.post('https://collaborhub-backend.onrender.com/api/user/login', data);
            console.log(response.data);

            if (response.data.success) {
                setShowOtpField(true);
                alert('OTP inviato alla tua email. Controlla la tua casella di posta.');
            } else {
                setError(response.data.message);
            }

        } catch (err) {
            if (err.status === 400) {
                setError(err.response.data.msg);
            }
        }
    }

    const handleOtpVerification =async(e) => {
        e.preventDefault();
        const data = new FormData();
        data.append('otp', otp);
        try {
            const response = await axios.post('https://collaborhub-backend.onrender.com/api/user/verifyOtp', data);
            console.log(response.data);
            if (response.data.success) {
                localStorage.setItem('user', JSON.stringify(response.data.user));
                window.location.href = '/home';
            } else {
                setError(response.data.message);
            }
        } catch (err) {
            if (err.status === 400) {
                setError(err.response.data.msg);
            }
        }
    }

    return (
        <Grid2 container direction="column" justifyContent="center" alignItems="center" style={{ minHeight: '100vh' }}>
            <Paper style={{padding:'20 px', height:'70 vh', width: 280, margin: 'auto'}}>
                <Grid2 align='center'>
                    <AccountCircleIcon/>
                    <Typography variant="h4" gutterBottom>
                        Login
                    </Typography>
                </Grid2>
                <form onSubmit={handleSubmit}>
                    <TextField label ='Username' name='username' placeholder='Inserisci username' value={formData.username} onChange={handleInput} fullWidth required/>
                    <TextField label ='Password' name='password' placeholder='Inserisci password' type ='password' value={formData.password} onChange={handleInput} fullWidth required/>
                    {error && (<FormHelperText sx={{ color: 'red' }}>{error}</FormHelperText>)}
                    {!showOtpField &&(
                        <Button type ='submit' color ='primary' variant= 'contained' style ={{margin : '8 px 0'}} fullWidth>
                            Accedi
                        </Button>
                    )}

                </form>
                {showOtpField && (
                    <form onSubmit={handleOtpVerification}>
                        <TextField label="Inserisci OTP per fare il Login" name="otp" placeholder="Inserisci OTP" value={otp} onChange={handleOtpInput} fullWidth required />
                        <Button type="submit" color="primary" variant="contained" style={{ margin: '8px 0' }} fullWidth>
                            Verifica OTP
                        </Button>
                    </form>
                )}
                <h5>Non hai un account? <a href ="/signup">Iscriviti</a> </h5>
            </Paper>
        </Grid2>
    )
}
export default Login;