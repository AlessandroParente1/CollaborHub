import * as React from 'react';
import { useState} from 'react';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import {useNavigate, NavLink} from 'react-router-dom';
import LoadingButton from '@mui/lab/LoadingButton';

const baseURL = "http://localhost:5000";

export default function Login({verify}) {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleSubmit = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        setLoading(true);
        fetch(`${baseURL}/api/user/login`, {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: data.get('email'),
                password: data.get('password')
            }),
        }).then((response) => response.json()).then((data) => {
            verify(data.success);
            if (!data.success) {
                alert("Email o password incorretti")
                setLoading(false);
            } else {
                window.localStorage.setItem("token", data.token) //Salvo il token in local storage
                navigate('/', {replace: true})
            }
        }).catch(e => {
            console.log(e)
        })
    };

    return(
        <Container component="main" maxWidth="xs">
            <Typography component="h1" variant="h5">
                <Login></Login>
            </Typography>
            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                    autoFocus
                />
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    />
                <LoadingButton
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                    loading={loading}
                >
                    Login
                </LoadingButton>
                <Grid container>
                    <Grid item xs>
                        <NavLink to="/register">
                            {'Non hai un account? Registrati'}
                        </NavLink>
                    </Grid>
                </Grid>
            </Box>

        </Container>
    )
}