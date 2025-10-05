import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import React from "react"
import { UserResponse, Channel } from "stream-chat";

type SidebarProps = {
  users: UserResponse[];
  activeChannel: Channel | null;
  currentUser: UserResponse;
  selectUser: (user: UserResponse) => void;
};

export default function Sidebar({ users, activeChannel, currentUser, selectUser }: SidebarProps) {
    const otherUsers = users.filter((user) => user.id !== currentUser.id);

    const renderUser = (user: UserResponse) => (
        <div
            key={user.id}
            className={`flex items-center p-2 gap-2 rounded-lg cursor-pointer transition ${
                activeChannel?.state?.members?.[user.id] ? "bg-primary/10" : "hover:bg-muted"
            }`}
            onClick={() => selectUser(user)}
            >
            <div className="relative">
                <img
                src={user.image || `https://api.dicebear.com/6.x/thumbs/svg?seed=${user.id}`}
                alt={user.name}
                className="w-12 h-12 md:w-12 md:h-12 rounded-full"
                />
                <span
                className={`absolute bottom-0 right-0 w-3 h-3 border-2 border-white rounded-full ${
                    user.online ? "bg-green-500" : "bg-gray-400"
                }`}
                ></span>
            </div>
            <span className="hidden md:inline font-semibold truncate md:text-base text-sm">
                {user.name || user.id}
            </span>
        </div>
    );
    return (
        <Card className="flex-shrink-0 w-20 md:w-96 h-full border-r rounded-xl overflow-hidden flex flex-col">
            <CardHeader className="px-4 py-3">
                <CardTitle className="hidden text-lg md:text-2xl md:block w-full text-left border-b-2 pb-2">
                    Chats
                </CardTitle>
            </CardHeader>
            <CardContent className="overflow-y-auto flex-1 space-y-2 flex flex-col justify-between">
                <div className="space-y-2">
                {otherUsers.length === 0 ? (
                    <p className="text-sm text-gray-500 text-center md:text-left">
                    No users online
                    </p>
                ) : (
                    otherUsers.map(renderUser)
                )}
                </div>

                {/* Logged-in user at the bottom */}
                <div className="border-t pt-2">{renderUser(currentUser)}</div>
            </CardContent>
        </Card>
    )
}