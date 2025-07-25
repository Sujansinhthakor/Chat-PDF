// Chats.tsx
"use client"

import { Chat } from "./ai-chat";
import { useState } from "react";
import { LoaderFive } from "@/components/ui/loader";

type ChatsProps = {
    chats: Chat[] | undefined;
};


const Chats = ({ chats }: ChatsProps) => {
    const showLoader = chats && chats.length > 0 && chats[chats.length - 1].type === "user";
    return (
        <div className="flex flex-col gap-2">
            {chats?.map((chat, index) => (
                <div
                    key={index}
                    className={`flex ${chat.type === "user" ? "justify-end" : "justify-start"}`}
                >
                    <div className={`${chat.type === "user" ? "bg-zinc-100 text-zinc-800" : "bg-zinc-800 text-white"} p-2 rounded-lg max-w-[60%] `}>
                        {chat.text}
                    </div>
                </div>
            ))}
            {showLoader && (
                <div className="flex justify-start">
                    <div className="bg-zinc-800 p-2 rounded-lg max-w-[60%] text-white">
                        <LoaderFive text="Generating chat..." />
                    </div>
                </div>
            )}
        </div>
    );
};

export default Chats;
