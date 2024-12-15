import ChatInput from "../components/ChatInput";
import Sidebar from "../components/SideBar";
import {useState} from "react";


function View ()  {
    const [selectedUser, setSelectedUser] = useState(null);

    const handleSelectUser = (user) => {
        setSelectedUser(user); // Aggiorna lo stato con l'utente selezionato
    };

    return (
        <div style={{ display: 'flex' }}>
            <Sidebar onSelectUser={(user) => setSelectedUser(user)} />
            <div style={{ flex: 1, padding: 16 }}>
                {selectedUser ? (
                    <div>
                        <h2>Chat con {selectedUser.username}</h2>
                        <Chat recipient={selectedUser} />
                        <ChatInput recipient={selectedUser} />
                    </div>
                ) : (
                    <h2>Seleziona un utente per iniziare la chat</h2>
                )}
            </div>
        </div>
    );
}

export default Chat;