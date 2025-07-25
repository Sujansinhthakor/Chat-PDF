"use client";
import React, { useState } from "react";
import { FileUpload } from "@/components/ui/file-upload";
import axios from "axios";

export function File_Upload() {
    const [files, setFiles] = useState<File[]>();
    const handleFileUpload = async (files: File[]) => {
        setFiles(files);
        const file = files[0];
        if (file) {
            const formdata = new FormData;
            formdata.append('pdf', file);
            await axios.post('http://localhost:8000/upload/pdf', formdata);
            console.log('file uploaded')
        }
    };
    return (
        <div className="">
            {files?.length! > 0 && <iframe className="w-full h-screen" src={URL.createObjectURL(files![0])}></iframe>}
            {files?.length == undefined && <FileUpload onChange={handleFileUpload} />}
        </div>
    );
}
