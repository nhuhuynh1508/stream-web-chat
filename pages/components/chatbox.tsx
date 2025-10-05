import { Button } from "@/components/ui/button";
import MDEditor from "@uiw/react-md-editor";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import React from "react";
import { Channel, LocalMessage, MessageResponse } from "stream-chat";
import { LogOut, Send } from "lucide-react";

type ChatboxProps = {
  activeChannel: Channel | null;
  clientId: string; 
  messages: (MessageResponse | LocalMessage)[];
  message: string;
  setMessage: (value: string) => void;
  sendMessage: () => void;
  logout: () => void;
};

export default function Chatbox({activeChannel, clientId, messages, message, setMessage, sendMessage, logout}: ChatboxProps) {
    const activeChatUser = Object.values(activeChannel?.state.members || []).find(
        (m) => m.user?.id !== clientId
    )?.user;

    return (
        <div className={`flex-1 flex flex-col ml-2 md:ml-5 md:p-5 rounded-xl border p-4 shadow-md ${
            activeChannel ? "bg-white" : "bg-gray-100"
        }`}>
            {activeChannel ? (
            <>
                <div className="flex items-center gap-3 mb-4 border-b pb-2">
                    <div className="relative">
                        <img
                            src={
                                activeChatUser?.image ||
                                `https://api.dicebear.com/6.x/thumbs/svg?seed=${activeChatUser?.id}`
                            }
                            className="w-10 h-10 rounded-full"
                        />
                        <span
                            className={`absolute bottom-0 right-0 w-3 h-3 border-2 border-white rounded-full ${
                                activeChatUser?.online ? "bg-green-500" : "bg-gray-400"
                            }`}
                        ></span>
                    </div>
                    <div className="flex justify-between items-center w-full px-2 py-2">
                        <div className="flex flex-col">
                            <h2 className="text-lg md:text-2xl font-semibold text-black">
                                {activeChatUser?.name || "User"}
                            </h2>
                            <p className="text-sm text-gray-500">
                                {activeChatUser?.online
                                    ? "Online"
                                    : activeChatUser?.last_active
                                    ? "Last active: " +
                                    new Date(activeChatUser.last_active).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                                    : "Offline"}
                            </p>
                        </div>
                        <button
                            onClick={logout}
                            className="items-center px-3 py-2 border border-red-500 text-red-500 text-sm md:text-sm rounded-lg hover:bg-red-200 transition cursor-pointer"
                        >
                            <LogOut />
                        </button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto mb-4 space-y-3 p-2">
                {messages.map((msg) => {
                    const isOwn = msg.user?.id === clientId;
                    return (
                    <div
                        key={msg.id}
                        className={`flex w-full gap-5 ${isOwn ? "justify-end" : "justify-start"}`}
                    >
                        {!isOwn && (
                            <img
                                src={
                                msg.user?.image ||
                                `https://api.dicebear.com/6.x/thumbs/svg?seed=${msg.user?.id}`
                                }
                                alt={msg.user?.name || "User"}
                                className="w-12 h-12 md:w-12 md:h-12 rounded-full"
                            />
                        )}
                        <div
                            className={`max-w-[75%] px-4 py-2 rounded-2xl shadow-sm transition-colors ${
                                isOwn
                                ? "bg-blue-400 text-primary-foreground rounded-br-none"
                                : "bg-white text-muted-foreground rounded-bl-none"
                            }`}
                        >
                        {/* <div className={`text-sm md:text-lg mb-1 ${isOwn ? "text-black" : "text-muted-foreground/70"}`}>
                            {msg.user?.name || msg.user?.id}
                        </div> */}
                        
                        <div className={`font-medium ${isOwn ? "text-white" : "text-black"}`}>
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                {msg.text || ""}
                            </ReactMarkdown>
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

                <div className="flex gap-2 items-center">
                    <MDEditor
                        value={message}
                        onChange={(value) => setMessage(value ?? "")}
                        height={100}
                        className="flex-1"
                        hideToolbar={false}
                    />
                    <Button onClick={sendMessage} className="bg-white border border-gray-600 shadow-sm text-black hover:bg-gray-300 cursor-pointer">
                        <Send /> Send 
                    </Button>
                </div>
            </>
            ) : (
                <div className="m-auto text-gray-500 text-xl font-sans">Select a user to start chatting 💬</div>
            )}
        </div>
    )
}