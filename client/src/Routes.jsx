import RegisterAndLoginForm from './RegisterAndLoginForm.jsx'
import {useContext} from "react";
import {UserContext} from "./UserContext.jsx";
import Chat from "./Chat.jsx"; //creare Chat

//questo contiene cosa vogliamo far vedere
export default function Routes(){
    const{username}=useContext(UserContext);

    if(username){
        return 'logged in';
    }

    return(

        <RegisterAndLoginForm />
    )

}