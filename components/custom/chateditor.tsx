import React, { useRef, useState } from "react";
import MDEditor from "@uiw/react-md-editor";
import { Button } from "@/components/ui/button";
import { Paperclip, Send, Smile } from "lucide-react";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";

type ChatEditorProps = {
  message: string;
  setMessage: React.Dispatch<React.SetStateAction<string>>;
  sendMessage: () => void;
};

export default function ChatEditor({ message, setMessage, sendMessage }: ChatEditorProps) {
  const [showEmoji, setShowEmoji] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setMessage((prev) => prev + `\n[${selectedFile.name}](#)\n`);
    }
  };

  /* eslint-disable @typescript-eslint/no-explicit-any */
  const handleEmojiSelect = (emoji: any) => {
    setMessage((prev) => prev + emoji.native);
    setShowEmoji(false);
  };


  return (
    <div className="relative flex flex-col gap-2 w-full p-2 from-gray-500 to-white rounded-2xl">
    {/* Toolbar buttons (emoji/file) outside the editor) */}
    <div className="flex gap-2 items-center mb-1">
        <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => setShowEmoji((s) => !s)}
            className="text-black cursor-pointer"
            >
            <Smile size={18} />
        </Button>

        <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => fileInputRef.current?.click()}
            className="text-black cursor-pointer"
            >
            <Paperclip size={18} />
        </Button>
    </div>

    {showEmoji && (
        <div className="absolute bottom-20 left-2 z-50 shadow-lg rounded-md">
        <Picker data={data} onEmojiSelect={handleEmojiSelect} />
        </div>
    )}

    <input type="file" ref={fileInputRef} onChange={handleFileSelect} className="hidden" />

    {/* Markdown editor */}
    <MDEditor
        value={message}
        onChange={(value) => setMessage(value ?? "")}
        height={150}
        data-color-mode="light"
        hideToolbar={false}
        onKeyDown={(e) => {
        if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        }}
    />

    {/* Send button */}
    <Button
        onClick={sendMessage}
        className="bg-white border border-gray-600 shadow-sm text-black hover:bg-gray-300 cursor-pointer mt-2"
    >
        <Send /> <div className="font-semibold">Send</div>
    </Button>
    </div>

  );
}
