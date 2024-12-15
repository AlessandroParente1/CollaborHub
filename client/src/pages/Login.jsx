import {useState} from 'react';
import axios from 'axios';
import TextField from '@mui/material/TextField';
import { FormHelperText, Grid2, Typography, Paper, Button  } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

function Login() {
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    })

    const [step, setStep] = useState(1); // Gestione dei passi: 1 = login, 2 = verifica codice
    const [verificationData, setVerificationData] = useState({
        userId: '',
        code: '',
    });

    const handleInput = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    }

    const handleVerificationInput = (e) => {
        setVerificationData({
            ...verificationData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        data.append('username', formData.username);
        data.append('password', formData.password);

        try {
            const response = await axios.post('http://localhost:5000/user/login', data);
            console.log(response.data);

            // Passa al secondo step
            setVerificationData((prev) => ({ ...prev, userId: response.data.userId }));
            setStep(2); // Mostra il modulo per il codice di verifica
        } catch (err) {
            if (err.status === 400) {
                setError(err.response.data.msg);
            }
        }
    }

    const handleCodeVerification = async (e) => {
        e.preventDefault();
        const { userId, code } = verificationData;

        try {
            const response = await axios.post('http://localhost:5000/user/verify-code', { userId, code });
            console.log(response.data);

            // Reindirizza l'utente dopo il successo
            window.location.href = '/home';
        } catch (err) {
            if (err.response && err.response.status === 400) {
                setError(err.response.data.msg);
            } else {
                setError('Errore durante la verifica del codice');
            }
        }
    };

    return (
        <Grid2 container direction="column" justifyContent="center" alignItems="center" style={{ minHeight: '100vh' }}>
            <Paper style={{padding:'20 px', height:'70 vh', width: 280, margin: 'auto'}}>
                <Grid2 align='center'>
                    <AccountCircleIcon/>
                    <Typography variant="h4" gutterBottom>
                        {step === 1 ? 'Login' : 'Verifica Codice'}
                    </Typography>
                </Grid2>
                {step === 1 ?(
                <form onSubmit={handleSubmit}>
                    <TextField label ='Username' name='username' placeholder='Inserisci username' value={formData.username} onChange={handleInput} fullWidth required/>
                    <TextField label ='Password' name='password' placeholder='Inserisci password' type ='password' value={formData.password} onChange={handleInput} fullWidth required/>
                    {error && (<FormHelperText sx={{ color: 'red' }}>{error}</FormHelperText>)}
                    <Button type ='submit' color ='primary' variant= 'contained' style ={{margin : '8 px 0'}} fullWidth>
                        Accedi
                    </Button>
                </form>
                    ):(
                    <form onSubmit={handleCodeVerification}>
                        <TextField label="Codice di Verifica" name="code" placeholder="Inserisci il codice" value={verificationData.code} onChange={handleVerificationInput} fullWidth required/>
                        {error && <FormHelperText sx={{ color: 'red' }}>{error}</FormHelperText>}
                        <Button type="submit" color="primary" variant="contained" style={{ margin: '8px 0' }} fullWidth>
                            Verifica
                        </Button>
                    </form>
                    )}

                <h5>Non hai un account? <a href ="/signup">Iscriviti</a> </h5>
            </Paper>
        </Grid2>


    )
}

export default Login;
