import {Button} from "@mui/material";
import {useEffect} from 'react';

export default function Chat() {
    //al mount del componente Chat
    useEffect(()=> {
        new WebSocket('ws://localhost:3001');


    },[]);

    //costruire la chat
    //magari può esser fatta con 2 colonne:
    //in una ci sono i conttti (che sarà grande 1/3 dello schermo), nell'altra la chat aperta (che sarà grande 2/3 dello schermo)
    //e poi una casella di testo in basso(un form) per scrivere un messaggio
    return(

        <div>chat here
        <input type="text"
               placeholder="Scrivi il tuo messaggio qui" />
            <Button>
                //inserire l'icona del mandare messaggio
                Manda messaggio
            </Button>
        </div>

    )
}