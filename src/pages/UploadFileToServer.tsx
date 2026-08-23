import axios from "axios";
import { CloudUpload, FileUp, Loader2 } from "lucide-react";
import { useState } from "react";
import FileDropZone from "../components/FileDropZone";
import { Button } from "../components/ui/button";

function UploadFileToServer() {
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);

  const handleSubmit = async () => {
    if (files.length === 0) {
      alert("Select files first before trying to upload");
      return;
    }

    try {
      setUploading(true);

      const formData = new FormData();
      formData.append("file", files[0]);

      const upload = await axios.post(
        "https://cloudify.kaushal.dev/api/upload",
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
      }
    } catch (e) {
      if (e instanceof Error) {
        alert(e.message);
      }
    } finally {
      setUploading(false);
    }
  };

  return (
    <main className="relative min-h-dvh overflow-hidden bg-background">
      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-[-180px] h-[400px] w-[400px] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-[-200px] left-[-100px] h-[350px] w-[350px] rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="relative flex min-h-dvh items-center justify-center px-4 py-10">
        <section className="w-full max-w-2xl">
          {/* Header */}
          <div className="mb-8 text-center">
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

          {/* Upload Card */}
          <div className="rounded-3xl border bg-card/80 p-5 shadow-xl shadow-black/5 backdrop-blur-sm sm:p-8">
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
