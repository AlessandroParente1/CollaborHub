import {useState} from 'react';
import axios from 'axios';
import TextField from '@mui/material/TextField';
import { FormHelperText, Grid2, Typography, Paper, Button } from '@mui/material';
import PersonAddIcon from '@mui/icons-material/AccountCircle';

function Signup () {
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        email: '',
        username: '',
        password: ''
    })

    const [step, setStep] = useState(1); // Gestione dei passi: 1 = registrazione, 2 = verifica codice
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
        data.append('email', formData.email);
        data.append('username', formData.username);
        data.append('password', formData.password);

        try {
            const response = await axios.post('http://localhost:5000/user/signUp', data, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            // Passa al secondo step
            setVerificationData((prev) => ({ ...prev, userId: response.data.userId }));
            setStep(2); // Mostra il modulo per il codice di verifica

        } catch (err) {
            if (err.status === 400){
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
            <Paper style ={{padding:'30 px 15 px', width: 350, margin: "20 px auto"}}>
                <Grid2 align="center">
                    <PersonAddIcon/>
                    <Typography variant="h4" gutterBottom>
                        {step === 1 ? 'Registrazione' : 'Verifica Codice'}
                    </Typography>
                    <Typography variant ="caption">
                        {step === 1
                            ? 'Compila il seguente form per registrarti'
                            : 'Inserisci il codice ricevuto via email per completare la registrazione'}
                    </Typography>
                </Grid2>
                {step === 1 ? (
                    <form onSubmit={handleSubmit}>
                        <TextField fullWidth label="Email" name="email" placeholder="Inserisci email" type="email" value={formData.email} required onChange={handleInput} />
                        <TextField fullWidth label="Username" name="username" placeholder="Inserisci username" value={formData.username} required onChange={handleInput} />
                        <TextField fullWidth label="Password" name="password" placeholder="Inserisci password" type="password" value={formData.password} required onChange={handleInput}/>
                        {error && <FormHelperText sx={{ color: 'red' }}>{error}</FormHelperText>}
                        <Button type="submit" variant="contained" color="primary" fullWidth>
                            Registrati
                        </Button>
                </form>
                    ): (
                        <form onSubmit={handleCodeVerification}>
                            <TextField fullWidth label="Codice di Verifica" name="code" placeholder="Inserisci il codice" value={verificationData.code} required onChange={handleVerificationInput} />
                            {error && <FormHelperText sx={{color: 'red'}}>{error}</FormHelperText>}
                            <Button type="submit" variant="contained" color="primary" fullWidth>
                                Verifica
                            </Button>
                        </form>
                    )}

                    < /Paper>

                    </Grid2>

                    )
                }

                export default Signup;