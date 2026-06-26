"use client"

import { useEffect, useState } from "react";
import { InputArea } from "./inputarea";
import Chats from "./chat";


export interface Chat {
    text: string,
    type: 'user' | 'bot'
}

const AI_Chat = () => {
    const [chats, setChats] = useState<Chat[]>([]);

    return (
        <div className="flex flex-col h-screen pt-5">
            <div className="flex-1 overflow-y-auto no-scrollbar">
                <Chats chats={chats} />
            </div>
            <div className="h-[20vh]">
                <InputArea setChats={setChats} chats={chats} />
            </div>
        </div>
    );
}
export default AI_Chat;