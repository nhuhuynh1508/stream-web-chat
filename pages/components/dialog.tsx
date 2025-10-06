"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { UserPlus } from "lucide-react";

type AddUserDialogProps = {
  onAddUser: (user: { id: string; name: string }) => void;
};

export function AddUserDialog({ onAddUser }: AddUserDialogProps) {
  const [open, setOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAdd = async () => {
    if (!username.trim()) return;
    setLoading(true);

    try {
      const res = await fetch("/api/token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: username.trim(),
          name: username.trim(),
        }),
      });

      if (!res.ok) throw new Error("Failed to create user");
      const data = await res.json();

      onAddUser({
        id: username.trim(),
        name: username.trim(),
      });

      console.log("User created, token:", data.token);
      setUsername("");
      setOpen(false);
    } catch (err) {
      console.error("Error adding user:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="flex items-center justify-center gap-2 text-sm font-medium border !border-gray-300 rounded-2xl !bg-white cursor-pointer !hover:bg-gray-800" 
        >
          <UserPlus size={18} />
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[400px] bg-white">
        <DialogHeader>
          <DialogTitle className="text-black">Add New User</DialogTitle>
          <DialogDescription>Input a user to start chatting...</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 mt-2">
          <Input
            placeholder="Enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="text-black"
          />
        </div>
        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => setOpen(false)} className="text-black cursor-pointer">
            Cancel
          </Button>
          <Button onClick={handleAdd} disabled={!username.trim() || loading} className="text-white cursor-pointer">
            {loading ? "Adding..." : "Add"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
