"use client";

import React, { useContext, useEffect, useState } from "react";
import { Context } from "../context";
import {
  StreamChat,
  Channel,
  UserResponse,
  MessageResponse,
  LocalMessage,
} from "stream-chat";

import Sidebar from "../components/custom/sidebar";
import Chatbox from "../components/custom/chatbox";
import { useRouter } from "next/navigation";

const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY!;

export default function Chats() {
  const { username } = useContext(Context);
  const router = useRouter();

  const [client, setClient] = useState<StreamChat | null>(null);
  const [activeChannel, setActiveChannel] = useState<Channel | null>(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<(MessageResponse | LocalMessage)[]>([]);

  const [users, setUsers] = useState<UserResponse[]>([]);

  // Initialize chat client
  useEffect(() => {
    if (!username) return;
    const chatClient = StreamChat.getInstance(apiKey);

    async function init() {
        const safeId = username.toLowerCase().replace(/[^a-z0-9@_-]/g, "-");

        const res = await fetch("/api/token", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId: safeId }),
        });
        const data = await res.json();
        if (!data.token) return;

        await chatClient.connectUser(
            {
                id: safeId,
                name: username,
                image: `https://api.dicebear.com/6.x/thumbs/svg?seed=${safeId}`,
            },
            data.token
        );

        setClient(chatClient);

        // Fetch users
        const response = await chatClient.queryUsers({}, { last_active: -1 }, { limit: 20 });
        const filtered = response.users.filter((u) => u.id !== safeId);
        setUsers(filtered);
    }

    init();
        return () => {
        chatClient.disconnectUser();
        };
    }, [username]);

    // Handle selecting a user
    async function selectUser(user: UserResponse) {
        if (!client || !user.id) return;

        const channel = client.channel("messaging", {
        members: [client.user!.id, user.id],
        });

        await channel.watch();

        // Listen for new messages
        const handleNewMessage = () => {
            setMessages([...channel.state.messages]);
            };
        channel.off("message.new", handleNewMessage);
        channel.on("message.new", handleNewMessage);

        setActiveChannel(channel);
        setMessages([...channel.state.messages]);
    }

    // Send a message
    async function sendMessage() {
        if (!message || !activeChannel) return;
        await activeChannel.sendMessage({ text: message });
        setMessage("");
    }

    async function logout() {
        if (client) {
            await client.disconnectUser();
            setClient(null);
            setActiveChannel(null);
            setUsers([]);
            setMessages([]);
        }

        router.push("/login");
    }
    

    if (!client)
        return <div className="p-6 text-gray-600">Loading chat...</div>;

    const currentUser: UserResponse | null = client?.user as UserResponse;

    function removeUser(userId: string) {
        setUsers(users.filter((u) => u.id !== userId));
    }

    function resetActiveChannel() {
        setActiveChannel(null); // clears the active chat
    };

    async function addUser(newUser: { id: string; name: string; image?: string }) {
        try {
            setUsers((prev) => [...prev, newUser]);
        } catch (err) {
            console.error("Error adding user:", err);
        }
    }

    return (
        <div className="flex h-screen bg-white text-foreground p-2 md:p-5">
            {/* Sidebar */}
            <Sidebar 
                users={users} 
                activeChannel={activeChannel}
                selectUser={selectUser}
                currentUser={currentUser}
                removeUser={removeUser}
                resetActiveChannel={resetActiveChannel}
                logout={logout}
                addUser={addUser}
            />

            {/* Chatbox */}
            <Chatbox
                activeChannel={activeChannel}
                clientId={client?.user?.id || ""}
                messages={messages}
                message={message}
                setMessage={setMessage}
                sendMessage={sendMessage}
                logout={logout}
            />
        </div>
    );
}
