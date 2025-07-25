"use client";

import { Send } from "lucide-react";
import { useState } from "react";
import { Chat } from "./ai-chat";
import axios from "axios";

interface MyInputProps {
    setChats: React.Dispatch<React.SetStateAction<Chat[]>>
    chats: Chat[] | undefined;
}

export function InputArea(props: MyInputProps) {
    const [inputValue, setInputValue] = useState('');
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
    };
    const handleOnClick = async () => {
        if (inputValue.length > 0 && (props.chats == undefined || props.chats.at(props.chats.length - 1)?.type != 'user')) {
            props.setChats(prev => [...prev, { text: inputValue, type: 'user' }]);
            const res = await axios.get('http://localhost:8000/chat', {
                params: {
                    message: inputValue
                }
            });
            props.setChats(prev => [...prev, { text: res.data.message, type: 'bot' }]);
            setInputValue('')
        }
    }
    return (
        <div className="flex justify-between border border-blue-900 p-5 rounded-xl  pb-15">
            <input
                onChange={handleChange}
                onKeyDown={(e) => {
                    if (e.key === "Enter") handleOnClick();
                }}
                value={`${inputValue}`}
                className="w-full focus:outline-none bg-transparent text-white"
                type="text"
                placeholder="What would you like to know?"
            />
            <div
                onClick={handleOnClick}
                className={`${inputValue.length > 0 ? "bg-zinc-100 transition-colors" : "bg-zinc-400"
                    } rounded-xl p-2 w-fit flex-col place-it`}>
                <Send color="black" size={20} />
            </div>
        </div>
    );
}
