// Chats.tsx
"use client"

import { Chat } from "./ai-chat";
import { useState } from "react";
import { Bot, User } from 'lucide-react'
import { LoaderFive } from "@/components/ui/loader";

type ChatsProps = {
    chats: Chat[] | undefined;
};


const Chats = ({ chats }: ChatsProps) => {
    const showLoader = chats && chats.length > 0 && chats[chats.length - 1].type === "user";
    return (
        <div className="flex flex-col gap-2 font-sans">
            {chats?.map((chat, index) => (
                <div
                    key={index}
                    className={`flex ${chat.type === "user" ? "justify-end " : "justify-start"}`}
                >
                    <div className={`${chat.type === "user" ? "bg-gradient-to-r from-purple-100 to-pink-100 text-purple-900" : "bg-gradient-to-r from-indigo-900 to-purple-900 text-white"} p-2 rounded-lg max-w-[60%] text-md `}>
                        <div className="flex gap-1">
                            <div>{chat.type == 'user' ? <User /> : <Bot />}</div>
                            <div>{chat.text}</div>
                        </div>
                    </div>
                </div>
            ))}
            {showLoader && (
                <div className="flex justify-start">
                    <div className="bg-gradient-to-r from-indigo-900 to-purple-900 p-2 rounded-lg max-w-[60%] text-white">
                        <LoaderFive text="Generating chat..." />
                    </div>
                </div>
            )}
        </div>
    );
};

export default Chats;