import RegisterAndLoginForm from './RegisterAndLoginForm.jsx'
import {useContext} from "react";
import {UserContext} from "./UserContext.jsx";

//questo contiene cosa vogliamo far vedere
export default function Routes(){
    const{username}=useContext(UserContext);

    if(username){
        return 'logged in' + username;
    }

    return(

        <RegisterAndLoginForm />
    )

}