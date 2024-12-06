import './App.css'
import Routes from './Routes'
import axios from 'axios';
import {UserContext, UserContextProvider} from "./UserContext.jsx";
import {useContext} from "react";

function App() {

  axios.defaults.baseURL='http://localhost:3001';
  axios.defaults.withCredentials = true; //Ciò significa che quando si effettuano richieste HTTP utilizzando Axios,
                                        // il browser includerà i cookie nelle intestazioni della richiesta,
                                        // consentendo l'autenticazione e la gestione della sessione.

  return (
      <UserContextProvider>
        <Routes />

      </UserContextProvider>


  )
}

export default App
