import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import React, { useState } from "react"
import { UserResponse, Channel } from "stream-chat";
import { LogOut, MoreHorizontal, X } from "lucide-react";
import { Search } from "./search";
import { AddUserDialog } from "./dialog";
import Image from "next/image";

type SidebarProps = {
  users: UserResponse[];
  activeChannel: Channel | null;
  currentUser: UserResponse;
  selectUser: (user: UserResponse) => void;
  removeUser: (userId: string) => void;
  resetActiveChannel: () => void;
  logout: () => void;
  addUser: (user: { id: string; name: string }) => void;
};

export default function Sidebar({ users, activeChannel, currentUser, selectUser, removeUser, resetActiveChannel, logout, addUser }: SidebarProps) {
    const otherUsers = users.filter((user) => user.id !== currentUser.id);
    const [menuOpen, setMenuOpen] = useState(false);

    const [searchQuery, setSearchQuery] = useState("")
    const filteredUsers = otherUsers.filter((user) =>
        (user.name || user.id).toLowerCase().includes(searchQuery.toLowerCase())
    );

    const renderUser = (user: UserResponse, clickable = true, removable = false, menuButton?: { icon: React.ReactNode; onClick: () => void }) => (
        <div
            key={user.id}
            className={`flex items-center p-2 gap-2 rounded-lg cursor-pointer transition ${
                activeChannel?.state?.members?.[user.id] ? "bg-primary/10" : "hover:bg-muted"
            }`}
            onClick={() => clickable && selectUser(user)}
            >
            <div className="relative flex-shrink-0">
                <Image
                    unoptimized
                    src={user.image || `https://api.dicebear.com/6.x/thumbs/png?seed=${user.id}`}
                    alt={user.name || "username"}
                    width={48}
                    height={48}
                    className="w-12 h-12 md:w-12 md:h-12 rounded-full"
                />
                <span
                className={`absolute bottom-0 right-0 w-3 h-3 border-2 border-white rounded-full ${
                    user.online ? "bg-green-500" : "bg-gray-400"
                }`}
                ></span>
            </div>
            <div className="flex justify-between items-center w-full"> 
                <span className="hidden md:inline font-medium truncate md:text-base text-sm text-gray-700">
                    {user.name || user.id}
                </span>
                {removable && (
                    <button
                    onClick={(e) => {
                        e.stopPropagation();
                        removeUser(user.id);
                        resetActiveChannel();
                    }}
                    className="text-gray-400 hover:text-red-500 transition p-1 cursor-pointer"
                    >
                        <X size={18} />
                    </button>
                )}
            </div>
            {menuButton && (
                <button
                    onClick={(e) => {
                    e.stopPropagation();
                    menuButton.onClick();
                    }}
                    className="text-gray-400 hover:text-gray-700 transition p-1 cursor-pointer flex-shrink-0"
                >
                    {menuButton.icon}
                </button>
            )}
        </div>
    );

    
    return (
        <Card className="flex-shrink-0 w-20 md:w-96 h-full border-r rounded-xl overflow-hidden flex flex-col bg-gradient-to-br from-blue-200 to-white">
            <CardHeader className="px-4 py-3">
                <div className="flex items-center justify-between w-full border-b-2 border-gray-300 pb-2">
                    <CardTitle className="hidden md:block text-lg md:text-2xl text-left">
                        Chats
                    </CardTitle>
                    <div className="flex-shrink-0">
                        <AddUserDialog onAddUser={addUser} />
                    </div>
                </div>
                <div className="hidden md:block sticky top-0 z-10 py-3">
                    <Search onSearch={setSearchQuery} />
                </div>
            </CardHeader>
            <CardContent className="overflow-y-auto flex-1 space-y-2 flex flex-col">
                <div className="space-y-1">
                    {otherUsers.length === 0 ? (
                    <p className="text-md text-gray-500 text-center justify-center">
                    No users online.
                    </p>
                ) : (
                    filteredUsers.map((user) => renderUser(user, true, true))
                )}
                </div>

                {/* Logged-in user at the bottom */}
                <div className="border-t pt-2 mt-auto">
                    <div className="flex items-center justify-between p-2 gap-2 rounded-lg relative">
                        {/* Avatar */}
                        <div className="relative flex-shrink-0">
                        <Image
                            unoptimized
                            src={currentUser.image || `https://api.dicebear.com/6.x/thumbs/png?seed=${currentUser.id}`}
                            alt={currentUser.name || "username"}
                            width={48}
                            height={48}
                            className="w-12 h-12 md:w-12 md:h-12 rounded-full"
                        />
                        <span
                            className={`absolute bottom-0 right-0 w-3 h-3 border-2 border-white rounded-full ${
                            currentUser.online ? "bg-green-500" : "bg-gray-400"
                            }`}
                        ></span>
                        </div>

                        {/* Name */}
                        <span className="truncate font-medium text-sm md:text-base text-gray-700 flex-1">
                            {currentUser.name || currentUser.id}
                        </span>

                        <div className="relative">
                            <button
                                onClick={(e) => {
                                e.stopPropagation();
                                setMenuOpen(!menuOpen);
                                }}
                                className="text-gray-400 hover:text-gray-700 transition p-1 cursor-pointer flex-shrink-0"
                            >
                                <MoreHorizontal size={18} />
                            </button>

                            {/* Dropdown positioned next to the icon */}
                            {menuOpen && (
                                <div className="absolute bottom-full right-0 ml-2 w-32 bg-white border rounded-lg shadow-lg z-50">
                                    <button
                                        onClick={logout}
                                        className="flex items-center w-full px-3 py-2 text-sm text-red-500 hover:bg-red-100 transition rounded-lg cursor-pointer"
                                    >
                                        <LogOut size={16} className="mr-2" />
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>                
            </CardContent>
        </Card>
    )
}