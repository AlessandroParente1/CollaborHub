import ChatInput from "./ChatInput";
import UserSidebar from "./UserSideBar";


function Chat ()  {
    return (
        <div className="chat">
            <ChatInput />
            <UserSidebar />

        </div>
    );
}

export default Chat;