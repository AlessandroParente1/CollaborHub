import './App.css'
import Routes from './Routes'
import axios from 'axios';
import {UserContext, UserContextProvider} from "./UserContext.jsx";
import {useContext} from "react";

function App() {

  axios.defaults.baseURL='http://localhost:3001';
  axios.defaults.withCredentials = true; //setta i cookie dall'api

  return (
      <UserContextProvider>
        <Routes />

      </UserContextProvider>


  )
}

export default App
