import * as React from 'react';
import {useState} from 'react';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import {useNavigate, NavLink} from 'react-router-dom';
import LoadingButton from '@mui/lab/LoadingButton';

const baseURL = "http://localhost:5000";

export default function Register() {

    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleSubmit = (event) => {
        event.preventDefault();
        setLoading(true)
        const data = new FormData(event.currentTarget);
        fetch(`${baseURL}/api/user/register`, {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: data.get('email'),
                password: data.get('password')
            })
        }).then((response) => response.json()).then((data) => {
            if(!data.success) {
                alert("Esiste già un utente associato a questo indirizzo email")
            } else {
                navigate('/login')
            }
        }).catch(e => {
            console.log(e)
        })
    };

    return (
        <Container component="main" maxWidth="xs">
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Typography component="h1" variant="h5">
                    Register
                </Typography>
                <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                autoComplete="email"
                                name="email"
                                required
                                fullWidth
                                id="email"
                                label="Email Address"
                                autoFocus
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type="password"
                                id="password"
                                autoComplete="new-password"
                            />
                        </Grid>
                    </Grid>
                    <LoadingButton
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                        loading={loading}
                    >
                        Register
                    </LoadingButton>
                    <Grid container justifyContent="flex-end">
                        <Grid item>
                            <NavLink to="/login">
                                {'Already have an account? Login'}
                            </NavLink>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </Container>
    );



}