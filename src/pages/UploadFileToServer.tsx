import axios from "axios";
import { useState } from "react";
import FileDropZone from "../components/FileDropZone";
import { Button } from "../components/ui/button";

function UploadFileToServer() {
    const [files, setFiles] = useState<File[]>([]);

    const handleSubmit = async () => {
        if (files.length === 0) {
            alert("Select files first before trying to upload");
            return;
        }
        try {
            const formData = new FormData();
            formData.append("file", files[0]);
            const upload = await axios.post("http://localhost:3001/upload", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            if (upload.data.success && upload.data.success === 1) {
                alert("File uploaded successfully!");
                setFiles([]);
            }
        } catch (e) {
            if (e instanceof Error) {
                alert(e.message);
            }

        }
    };

    return (
        <div>
            <div className="flex flex-col items-center justify-center gap-5 h-dvh bg-black">
                <FileDropZone files={files} setFiles={setFiles} />
                <Button className="h-18 w-42" onClick={handleSubmit}>Upload</Button>
            </div>
        </div>
    );
}

export default UploadFileToServer;
