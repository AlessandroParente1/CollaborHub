import React, { createContext, useState, useContext, useEffect } from 'react';

// Crea il contesto
const CurrentUserContext = createContext();

// Crea il provider per il contesto
export const CurrentUserProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        // Verifica se c'è un ID utente memorizzato nel localStorage (o da una sessione)
        const storedUserId = localStorage.getItem('currentUserId');
        if (storedUserId) {
            setCurrentUser({ _id: storedUserId });
        }
    }, []);

    const login = (userId) => {
        // Memorizza l'ID utente nel localStorage
        localStorage.setItem('currentUserId', userId);
        setCurrentUser({ _id: userId });
    };

    const logout = () => {
        // Rimuovi l'ID utente dal localStorage
        localStorage.removeItem('currentUserId');
        setCurrentUser(null);
    };

    return (
        <CurrentUserContext.Provider value={{ currentUser, login, logout }}>
            {children}
        </CurrentUserContext.Provider>
    );
};

// Crea un hook per accedere al contesto
export const useCurrentUser = () => {
    return useContext(CurrentUserContext);
};
