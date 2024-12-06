import React, {useContext, useState} from 'react';
import { TextField, Button, FormControl, FormHelperText } from '@mui/material';
import axios from 'axios';
import { UserContext } from './UserContext';

function RegisterAndLoginForm() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoginOrRegister, setIsLoginOrRegister] = useState('register');
    const [error, setError] = useState('');
    const  {setUsername:setLoggedInUsername,setId} = useContext(UserContext);

   async function handleSubmit(event){
       event.preventDefault();
       const url=isLoginOrRegister==='register'? '/register':'/login';
       const {data} = await axios.post(url, {username, password});
       setLoggedInUsername(username);
       setId(data.id);

   }

    return (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '300px', margin: 'auto', alignItems: 'center' }}>
            <FormControl fullWidth error={!!error}>
                <TextField
                    label="Username"
                    variant="outlined"
                    value={username}
                    onChange={(event) => setUsername(event.target.value)}
                    fullWidth
                />
                {error && <FormHelperText>{error}</FormHelperText>}
            </FormControl>

            <FormControl fullWidth error={!!error}>
                <TextField
                    label="Password"
                    type="password"
                    variant="outlined"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    fullWidth
                />
                {error && <FormHelperText>{error}</FormHelperText>}
            </FormControl>

            <Button variant="contained" color="primary" type="submit" fullWidth>
                {isLoginOrRegister ==='register'?'Register': 'Login'}
            </Button>

            <div className="text-center">
                {isLoginOrRegister ==='register' &&(
                    <div>
                    Already a member?
                    <Button onClick={() => setIsLoginOrRegister('login')}>
                        Login here
                    </Button>
                    </div>
                )}
                {isLoginOrRegister==='login'&&(
                    <div>
                        Don't have an account?
                        <Button onClick={() => setIsLoginOrRegister('register')}>
                            Register here
                        </Button>
                    </div>
                )}
            </div>
        </form>
    );
}

export default RegisterAndLoginForm;
