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

    // useEffect(() => {
    //     setTimeout(() => {
    //         setChats(prev => [...prev, { text: "Hey There how are doing?", type: 'bot' }]);
    //     }, 3000)
    // }, [])

    return <>
        <div className=" h-[80%]">
            <Chats chats={chats}></Chats>
        </div>
        <div className=" h-[20%]">
            <InputArea setChats={setChats} chats={chats} />
        </div>
    </>
}
export default AI_Chat;