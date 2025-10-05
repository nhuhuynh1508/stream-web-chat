"use client";

import { useContext, useState } from "react";
import { useRouter } from "next/router";
import { Context } from "../context";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function LoginPage() {
  const { username, setUsername } = useContext(Context);
  
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    if (!username.trim()) {
      setError("Please enter a username");
      return;
    }
    setError("");
    router.push("/chats");
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-indigo-200 to-white">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <Avatar className="mx-auto mb-2">
            <AvatarImage src={`https://api.dicebear.com/6.x/thumbs/svg?seed=${username || "guest"}`} />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
          <CardTitle className="text-2xl font-semibold">Welcome to Chat</CardTitle>
          <CardDescription>Enter your name to get started 💬</CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6 flex flex-col items-center p-3">
            <Input
              type="text"
              placeholder="Enter your username..."
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />

            {error && <p className="text-sm text-red-500">{error}</p>}

            <Button type="submit" className="w-full max-w-2xs cursor-pointer hover:bg-gray-700">
              Start Chatting
            </Button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-4">
            Your username will generate a random avatar automatically 🪄
          </p>
        </CardContent>
      </Card>
    </div>
  );
}