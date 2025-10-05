import React from "react";
import { useState, createContext } from "react";

interface ContextType {
    username: string;
    setUsername: React.Dispatch<React.SetStateAction<string>>;
    secret: string;
    setSecret: React.Dispatch<React.SetStateAction<string>>;
}

export const Context = createContext<ContextType>({
    username: "",
    setUsername: () => {},
    secret: "",
    setSecret: () => {},
});

interface ContextProviderProps {
    children: React.ReactNode;
}

export const ContextProvider = ({ children }: ContextProviderProps) => {
    const [username, setUsername] = useState("");
    const [secret, setSecret] = useState("");

    const value = { username, setUsername, secret, setSecret };

    return (
        <Context.Provider value={value}>
            {children}
        </Context.Provider>
    );
}