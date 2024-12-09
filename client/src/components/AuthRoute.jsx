import React, {useState} from "react";
import {createBrowserRouter, Navigate, RouterProvider} from "react-router-dom";
import App from "../App.jsx";
import verifyToken from "../services/verifyToken.js";
import Login from "./Login";
import Register from "./Register";

import ChatWindow from "./ChatWindow";

export default function AuthRoute() {
    const [isValidToken, setIsValidToken] = useState(verifyToken);
    // Elenco di route private, accessibili solo se il token non è scaduto

    const privateRouter = createBrowserRouter([
        {
            path: "/",
            element: <App/>
        },
        {
            path: "/login",
            element: <Login verify={setIsValidToken}/>
        },
        {
            path: "/register",
            element: <Register />
        },
        {
            path: "/chats",
            element: <ChatWindow/>
        },
       //non so come mettere ChatList.jsx
    ])

    // Elenco di route pubbliche, accessibili anche senza token
    const publicRouter = createBrowserRouter([
        {
            path: "/",
            element: <Navigate to="/login"/>
        },
        {
            path: "/login",
            element: <Login verify={setIsValidToken} />
        },
        {
            path: "/register",
            element: <Register />
        }
    ])

    return (
        <RouterProvider router={(isValidToken) ? privateRouter : publicRouter}/>
    );

}
