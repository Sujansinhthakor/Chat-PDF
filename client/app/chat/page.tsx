"use client";

import AI_Chat from "../_component/ai-chat";
import { File_Upload } from "../_component/file_upload";
import { UserButton } from "@clerk/nextjs";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { useState } from "react";

export default function Chat() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [hasDocument, setHasDocument] = useState(false);

  return (
    <div className="flex flex-col h-screen bg-[#13110f] text-[#ECE7DF]">
      {/* ── Header ── */}
      <header className="flex items-center justify-between px-6 py-3.5 border-b border-[#2A2722] shrink-0">
        <div className="flex items-center gap-3">
          {hasDocument && (
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-1.5 rounded text-[#9C968C] hover:bg-white/5 hover:text-[#ECE7DF] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#E8A33D] focus-visible:outline-offset-2"
              aria-label="Toggle document panel"
            >
              {sidebarOpen ? <PanelLeftClose size={17} /> : <PanelLeftOpen size={17} />}
            </button>
          )}
          <div className="flex items-center gap-2.5">
            <span aria-hidden className="inline-block w-1.5 h-4 bg-[#E8A33D] -rotate-6 rounded-[1px]" />
            <span className="font-serif text-lg">ChatPDF</span>
          </div>
        </div>
        <UserButton appearance={{ elements: { avatarBox: "w-8 h-8" } }} />
      </header>

      {/* ── Main ── */}
      <div className="flex flex-1 overflow-hidden">
        {/* Document panel (acts as full-screen centered container if !hasDocument) */}
        <div
          className={`${
            hasDocument
              ? sidebarOpen
                ? "w-1/2 border-r border-[#2A2722]"
                : "w-0 border-r-0"
              : "w-full flex items-center justify-center"
          } transition-[width] duration-300 ease-in-out overflow-hidden shrink-0`}
        >
          <div className={`h-full flex flex-col ${hasDocument ? "w-full" : "w-full max-w-md text-center px-6 justify-center"}`}>
            {hasDocument && (
              <div className="px-4 py-2 border-b border-[#2A2722] shrink-0">
                <span className="text-xs font-mono text-[#9C968C] uppercase tracking-wide">
                  Document
                </span>
              </div>
            )}

            {!hasDocument && (
              <>
                <h1 className="font-serif text-2xl mb-2">Drop in a document, start asking</h1>
                <p className="text-sm text-[#9C968C] mb-8">
                  Upload a PDF and ask it anything — ChatPDF reads it so you don't have to.
                </p>
              </>
            )}

            <div className={hasDocument ? "flex-1 overflow-auto" : "w-full"}>
              <File_Upload onUploaded={() => setHasDocument(true)} />
            </div>
          </div>
        </div>

        {/* Chat panel */}
        {hasDocument && (
          <div className="flex-1 flex flex-col min-w-0">
            <div className="px-4 py-2 border-b border-[#2A2722] shrink-0">
              <span className="text-xs font-mono text-[#9C968C] uppercase tracking-wide">
                Chat
              </span>
            </div>
            <div className="flex-1 overflow-hidden px-4">
              <AI_Chat />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}