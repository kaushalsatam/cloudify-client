import axios from "axios";
import { Check, CloudUpload, Copy, Download, FileUp, Loader2, LogOut, RefreshCw } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import FileDropZone from "../components/FileDropZone";
import { Button } from "../components/ui/button";
import { api } from "../lib/api";

interface UploadFileToServerProps {
  onLogout: () => void;
}

function UploadFileToServer({ onLogout }: UploadFileToServerProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [storedFiles, setStoredFiles] = useState<string[]>([]);
  const [loadingFiles, setLoadingFiles] = useState(true);
  const [copiedFile, setCopiedFile] = useState<string | null>(null);

  const handleSessionError = useCallback((error: unknown) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      onLogout();
      alert("Your session has expired. Please sign in again.");
      return true;
    }
    return false;
  }, [onLogout]);

  const loadFiles = useCallback(async () => {
    try {
      setLoadingFiles(true);
      const response = await api.get<{ files: string[] }>("/files");
      setStoredFiles(response.data.files);
    } catch (error) {
      if (!handleSessionError(error)) alert("Unable to load your files.");
    } finally {
      setLoadingFiles(false);
    }
  }, [handleSessionError]);

  useEffect(() => {
    const timer = window.setTimeout(() => void loadFiles(), 0);
    return () => window.clearTimeout(timer);
  }, [loadFiles]);

  const handleSubmit = async () => {
    if (files.length === 0) {
      alert("Select files first before trying to upload");
      return;
    }

    try {
      setUploading(true);

      const formData = new FormData();
      formData.append("file", files[0]);

      const upload = await api.post(
        "/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      if (upload.data.success === 1) {
        alert("File uploaded successfully!");
        setFiles([]);
        await loadFiles();
      }
    } catch (e) {
      if (!handleSessionError(e) && e instanceof Error) {
        alert(e.message);
      }
    } finally {
      setUploading(false);
    }
  };

  const downloadFile = async (filename: string) => {
    try {
      const response = await api.get(`/files/${encodeURIComponent(filename)}`, { responseType: "blob" });
      const url = URL.createObjectURL(response.data);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } catch (error) {
      if (!handleSessionError(error)) alert("Unable to download this file.");
    }
  };

  const copyPublicUrl = async (filename: string) => {
    try {
      const response = await api.post<{ url: string }>(`/files/${encodeURIComponent(filename)}/share`);
      await navigator.clipboard.writeText(response.data.url);
      setCopiedFile(filename);
      window.setTimeout(() => setCopiedFile((current) => current === filename ? null : current), 2000);
    } catch (error) {
      if (!handleSessionError(error)) alert("Unable to create a public link. Check that your browser allows clipboard access.");
    }
  };

  return (
    <main className="relative min-h-dvh overflow-hidden bg-background">
      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-[-180px] h-[400px] w-[400px] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-[-200px] left-[-100px] h-[350px] w-[350px] rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="relative flex min-h-dvh items-center justify-center px-3 py-6 sm:px-4 sm:py-10">
        <section className="w-full max-w-2xl">
          {/* Header */}
          <div className="mb-6 text-center sm:mb-8">
            <div className="mb-4 flex justify-end">
              <Button variant="outline" size="sm" onClick={onLogout}>
                <LogOut className="mr-2 h-4 w-4" /> Sign out
              </Button>
            </div>
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border bg-background/80 shadow-sm backdrop-blur">
              <CloudUpload className="h-7 w-7 text-primary" />
            </div>

            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Upload your files
            </h1>

            <p className="mt-2 text-sm text-muted-foreground sm:text-base">
              Drag and drop your files here, or select them from your device.
            </p>
          </div>

          <section className="mt-6 rounded-2xl border bg-card/80 p-4 shadow-xl shadow-black/5 backdrop-blur-sm sm:rounded-3xl sm:p-8">
            <div className="mb-4 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold">Your files</h2>
                <p className="text-sm text-muted-foreground">Downloads are available only while signed in.</p>
              </div>
              <Button variant="outline" size="icon" onClick={() => void loadFiles()} disabled={loadingFiles} aria-label="Refresh files">
                <RefreshCw className={`h-4 w-4 ${loadingFiles ? "animate-spin" : ""}`} />
              </Button>
            </div>
            {loadingFiles ? (
              <p className="text-sm text-muted-foreground">Loading files…</p>
            ) : storedFiles.length ? (
              <ul className="max-h-60 space-y-2 overflow-y-auto">
                {storedFiles.map((filename) => (
                  <li key={filename} className="flex flex-col gap-2 rounded-xl border p-3 sm:flex-row sm:items-center sm:justify-between">
                    <span className="min-w-0 break-all text-sm sm:truncate">{filename}</span>
                    <div className="grid shrink-0 grid-cols-2 gap-2 sm:flex sm:gap-1">
                      <Button className="w-full sm:w-auto" variant="ghost" size="sm" onClick={() => void downloadFile(filename)}>
                        <Download className="mr-2 h-4 w-4" /> Download
                      </Button>
                      <Button className="w-full sm:w-auto" variant="outline" size="sm" onClick={() => void copyPublicUrl(filename)}>
                        {copiedFile === filename ? <Check className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}
                        {copiedFile === filename ? "Copied" : "Copy public URL"}
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">No files uploaded yet.</p>
            )}
          </section>

          {/* Upload Card */}
          <div className="rounded-2xl border bg-card/80 p-4 shadow-xl shadow-black/5 backdrop-blur-sm sm:rounded-3xl sm:p-8">
            <FileDropZone files={files} setFiles={setFiles} />

            {/* Selected file status */}
            <div className="mt-5 min-h-12">
              {files.length > 0 ? (
                <div className="flex items-center gap-3 rounded-xl border bg-muted/40 px-4 py-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <FileUp className="h-4 w-4 text-primary" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">
                      {files[0].name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {files[0].size < 1024 * 1024
                        ? `${(files[0].size / 1024).toFixed(1)} KB`
                        : `${(files[0].size / (1024 * 1024)).toFixed(1)} MB`}
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-center text-xs text-muted-foreground">
                  No file selected
                </p>
              )}
            </div>

            {/* Upload button */}
            <Button
              className="mt-5 h-12 w-full rounded-xl text-sm font-medium shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
              onClick={handleSubmit}
              disabled={files.length === 0 || uploading}
            >
              {uploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <CloudUpload className="mr-2 h-4 w-4" />
                  Upload File
                </>
              )}
            </Button>
          </div>

          {/* Footer hint */}
          <p className="mt-5 text-center text-xs text-muted-foreground">
            Your file will be securely uploaded to Cloudify.
          </p>
        </section>
      </div>
    </main>
  );
}

export default UploadFileToServer;
