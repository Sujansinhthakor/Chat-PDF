"use client";
import React, { useState } from "react";
import { FileUpload } from "@/components/ui/file-upload";
import axios from "axios";

interface FileUploadProps {
    onUploaded?: () => void;
}

export function File_Upload({ onUploaded }: FileUploadProps) {
    const [files, setFiles] = useState<File[]>([]);
    const [isUploaded, setIsUploaded] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [activeFileIdx, setActiveFileIdx] = useState(0);

    const handleSubmit = async () => {
        if (files.length === 0) return;
        setIsUploading(true);
        try {
            for (const file of files) {
                const formdata = new FormData();
                formdata.append('pdf', file);
                await axios.post('http://localhost:8000/upload/pdf', formdata);
            }
            console.log('All files uploaded successfully');
            setIsUploaded(true);
            if (onUploaded) {
                onUploaded();
            }
        } catch (error) {
            console.error('Error uploading files:', error);
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="flex flex-col h-full w-full relative">
            {isUploaded ? (
                <>
                    {files.length > 1 && (
                        <div className="flex gap-2 p-2 overflow-x-auto bg-[#13110f] border-b border-[#2A2722] shrink-0">
                            {files.map((f, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setActiveFileIdx(idx)}
                                    className={`px-4 py-1.5 text-sm rounded-full whitespace-nowrap transition-colors ${
                                        activeFileIdx === idx 
                                        ? 'bg-[#E8A33D]/10 text-[#E8A33D] font-medium border border-[#E8A33D]/20' 
                                        : 'bg-transparent text-[#9C968C] hover:bg-white/5 border border-transparent'
                                    }`}
                                >
                                    {f.name}
                                </button>
                            ))}
                        </div>
                    )}
                    {files[activeFileIdx] && (
                        <iframe 
                            className="w-full flex-1 border-0" 
                            src={URL.createObjectURL(files[activeFileIdx])}
                        />
                    )}
                </>
            ) : (
                <div className="flex flex-col items-center w-full h-full pb-10 overflow-auto">
                    <FileUpload files={files} onChange={setFiles} />
                    {files.length > 0 && (
                        <button
                            onClick={handleSubmit}
                            disabled={isUploading}
                            className="mt-6 px-8 py-2.5 bg-[#E8A33D] text-[#13110f] rounded-full font-medium hover:bg-[#d69536] transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[#E8A33D]/20 flex items-center gap-2"
                        >
                            {isUploading ? 'Uploading...' : 'Start Chatting'}
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}
