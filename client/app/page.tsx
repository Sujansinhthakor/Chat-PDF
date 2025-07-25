"use client"

import AI_Chat from "./_component/ai-chat";
import { File_Upload } from "./_component/file_upload";

export default function Home() {
  return (
    <div className="flex min-h-screen">
      <div className="w-1/2 m-auto">
        <File_Upload />
      </div>
      <div className="border-l-2 my-5 border-neutral-500"></div>
      <div className="w-1/2 mt-5 px-5 ">
        <AI_Chat />
      </div>
    </div>
  );
}