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
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY!;

export default function Chats() {
  const { username } = useContext(Context);
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

    if (!client)
        return <div className="p-6 text-gray-600">Loading chat...</div>;

    return (
        <div className="flex h-screen bg-white text-foreground p-2 md:p-5">
        {/* Sidebar */}
        <Card className="flex-shrink-0 w-20 md:w-96 h-full border-r rounded-xl overflow-hidden">
            <CardHeader>
                <CardTitle className="md:text-left md:text-2xl text-xl w-full mr-3">Chats</CardTitle>
            </CardHeader>
            <CardContent className="overflow-y-auto max-h-full space-y-2">
            {users.length === 0 ? (
                <p className="text-sm text-gray-500 text-center md:text-left">No users online</p>
            ) : (
                users.map((user) => (
                <div
                    key={user.id}
                    className={`flex items-center p-2 gap-2 rounded-lg cursor-pointer transition ${
                    activeChannel?.state?.members?.[user.id]
                        ? "bg-primary/10"
                        : "hover:bg-muted"
                    }`}
                    onClick={() => selectUser(user)}
                >
                    <img
                    src={user.image || `https://api.dicebear.com/6.x/thumbs/svg?seed=${user.id}`}
                    alt={user.name}
                    className="w-10 h-10 rounded-full"
                    />
                    {/* Only show username on md+ */}
                    <span className="hidden md:inline font-medium truncate md:text-base text-sm">
                    {user.name || user.id}
                    </span>
                </div>
                ))
            )}
            </CardContent>
        </Card>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col ml-2 md:ml-5 rounded-xl border p-4">
            {activeChannel ? (
            <>
                <h2 className="text-lg font-semibold mb-2">
                Chatting with{" "}
                {Object.values(activeChannel.state.members)
                    .find((m) => m.user?.id !== client?.user?.id)
                    ?.user?.name || "User"}
                </h2>

                <div className="flex-1 overflow-y-auto mb-4 space-y-3 p-2">
                {messages.map((msg) => {
                    const isOwn = msg.user?.id === client?.user?.id;
                    return (
                    <div
                        key={msg.id}
                        className={`flex w-full ${isOwn ? "justify-end" : "justify-start"}`}
                    >
                        <div
                        className={`max-w-[75%] px-4 py-2 rounded-2xl shadow-sm transition-colors ${
                            isOwn
                            ? "bg-primary text-primary-foreground rounded-br-none"
                            : "bg-muted text-muted-foreground rounded-bl-none"
                        }`}
                        >
                        <div className={`text-sm mb-1 ${isOwn ? "text-primary-foreground/70" : "text-muted-foreground/70"}`}>
                            {msg.user?.name || msg.user?.id}
                        </div>
                        <div className={`font-medium ${isOwn ? "text-white" : "text-black"}`}>
                            {msg.text}
                        </div>
                        {msg.created_at && (
                            <div className={`text-[10px] mt-1 text-right ${isOwn ? "text-primary-foreground/50" : "text-muted-foreground/50"}`}>
                            {new Date(msg.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                            </div>
                        )}
                        </div>
                    </div>
                    );
                })}
                </div>

                <div className="flex gap-2">
                <Input
                    placeholder="Type a message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                />
                <Button onClick={sendMessage}>Send</Button>
                </div>
            </>
            ) : (
            <div className="m-auto text-gray-500">Select a user to start chatting 💬</div>
            )}
        </div>
    </div>

  );
}
