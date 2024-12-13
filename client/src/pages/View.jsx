import Sidebar from "../components/SideBar";
import Chat from "../components/Chat";
import {useState} from "react";


function View ({userId})  {
    const [selectedUser, setSelectedUser] = useState(null);

    return (
        <div style={{
            display: "grid",
            gridTemplateColumns: "25% 75%",
        }}>
            <Sidebar onSelectUser={(user) => setSelectedUser(user)} />
            <div style={{ flex: 1, padding: 16 }}>
                {selectedUser ? (
                    <div>
                        <h2>Chat con {selectedUser.username}</h2>
                        <Chat selectedUser={selectedUser} userId={userId} />
                    </div>
                ) : (
                    <h2>Seleziona un utente per iniziare la chat</h2>
                )}
            </div>
        </div>
    );
}


export default View;