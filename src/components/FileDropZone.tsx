import Dropzone from "react-dropzone";
import {
    UploadCloud,
    File,
    X,
    FileImage,
    FileArchive,
    FileVideo,
} from "lucide-react";
import type { Dispatch, SetStateAction } from "react";

interface FileDropZoneProps {
    files: File[];
    setFiles: Dispatch<SetStateAction<File[]>>;
}

export default function FileDropZone({ files, setFiles }: FileDropZoneProps) {
    const addFile = (acceptedFiles: File[]) => {
        setFiles((prev) => [...prev, ...acceptedFiles]);
    };

    const removeFile = (index: number) => {
        setFiles((prev) => prev.filter((_, i) => i !== index));
    };

    const getIcon = (file: File) => {
        if (file.type.startsWith("image/")) return <FileImage size={20} />;
        if (file.type.startsWith("video/")) return <FileVideo size={20} />;
        if (
            file.type.includes("zip") ||
            file.name.endsWith(".rar") ||
            file.name.endsWith(".7z")
        )
            return <FileArchive size={20} />;

        return <File size={20} />;
    };

    const formatSize = (bytes: number) => {
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 ** 2) return `${(bytes / 1024).toFixed(1)} KB`;
        if (bytes < 1024 ** 3) return `${(bytes / 1024 ** 2).toFixed(1)} MB`;

        return `${(bytes / 1024 ** 3).toFixed(1)} GB`;
    };

    return (
        <Dropzone maxFiles={1} onDrop={addFile}>
            {({ getRootProps, getInputProps, isDragActive }) => (
                <div
                    {...getRootProps()}
                    className={`rounded-2xl border-2 border-dashed p-6 transition ${isDragActive
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-300 hover:border-blue-400"
                        }`}
                >
                    <input {...getInputProps()} />

                    {files.length === 0 ? (
                        <div className="flex h-64 flex-col items-center justify-center text-center">
                            <UploadCloud size={48} className="mb-4 text-gray-400" />

                            <h2 className="text-xl font-semibold">Drag & Drop Files</h2>

                            <p className="mt-2 text-sm text-gray-500">
                                Click or drag files here to upload
                            </p>
                        </div>
                    ) : (
                        <>
                            <div className="mb-4 flex items-center justify-between">
                                <div>
                                    <h2 className="font-semibold text-lg">Selected Files</h2>

                                    <p className="text-sm text-gray-500">
                                        Drag more files here to add them
                                    </p>
                                </div>

                                <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700">
                                    {files.length} file{files.length > 1 && "s"}
                                </span>
                            </div>

                            <div className="max-h-80 space-y-3 overflow-y-auto">
                                {files.map((file, index) => (
                                    <div
                                        key={`${file.name}-${index}`}
                                        className="flex items-center justify-between rounded-xl border bg-white p-3 shadow-sm"
                                    >
                                        <div className="flex items-center gap-3 overflow-hidden">
                                            <div className="rounded-lg bg-gray-100 p-2">
                                                {getIcon(file)}
                                            </div>

                                            <div className="min-w-0">
                                                <p className="truncate font-medium">{file.name}</p>

                                                <p className="text-sm text-gray-500">
                                                    {formatSize(file.size)}
                                                </p>
                                            </div>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                removeFile(index);
                                            }}
                                            className="rounded-md p-2 text-gray-500 hover:bg-red-100 hover:text-red-600"
                                        >
                                            <X size={18} />
                                        </button>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-5 rounded-lg bg-gray-50 p-3 text-center text-sm text-gray-500">
                                Drag & drop more files anywhere in this area or click to browse.
                            </div>
                        </>
                    )}
                </div>
            )}
        </Dropzone>
    );
}
