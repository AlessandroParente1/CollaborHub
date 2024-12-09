import React, { useEffect, useState } from "react";
import { List, ListItem, ListItemText, Typography } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
//in questo file si dovrebbero poter vedere la lista delle chat disponibili
const ChatList = () => {
    const [users, setUsers] = useState([]);
    const history = useNavigate();

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get("/api/user/all", {
                    withCredentials: true,
                });
                setUsers(response.data.users);
            } catch (error) {
                console.error("Error fetching users", error);
            }
        };

        fetchUsers();
    }, []);

    const handleChatClick = (userId) => {
        history(`/chat/${userId}`);//        history.push(`/chat/${userId}`);

    };

    return (
        <div>
            <Typography variant="h4">Users</Typography>
            <List>
                {users.map((user) => (
                    <ListItem button key={user._id} onClick={() => handleChatClick(user._id)}>
                        <ListItemText primary={user.email} />
                    </ListItem>
                ))}
            </List>
        </div>
    );
};

export default ChatList;
