import {getApi} from "./api.js";

const verifyToken = () => {
    if (localStorage.length > 0) {
        const res = getApi("verify");
        return !res.error; //Se mi restituiscono true vuol dire che c'è stato un errore nel token
    } else {
        return false;
    }

}

export default verifyToken;