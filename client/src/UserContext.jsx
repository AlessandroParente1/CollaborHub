import {useState, useEffect, createContext} from 'react';
import axios from 'axios';

export const UserContext =createContext({});

export function UserContextProvider({children}){

    const [username, setUsername] = useState(null);
    const [id,setId] = useState(null);

    //ogni volta che viene usato
    useEffect(()=>{
        //ci assicuriamo che lo user sia logged in
        axios.get('/profile').then(response=>{

            setId(response.data.userId);
            setUsername(response.data.username);
        })
    },[])

    return(
        <UserContext.Provider value={{username, setUsername,id, setId}}>
            {children}
        </UserContext.Provider>
    );

}