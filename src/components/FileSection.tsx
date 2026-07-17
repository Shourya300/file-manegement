"use client";

import { useEffect, useRef, useState } from "react";
import { DriveFile } from "../types//fileTypes";
import FileCard from "./fileCard";

interface FileSectionProps {
  assignmentId: string;
}

export default function FileSection({ assignmentId }: FileSectionProps) {
  const [files, setFiles] = useState<DriveFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [deletingIds, setDeletingIds] = useState<string[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  async function fetchFiles() {
    setLoading(true);

    try {
      const response = await fetch(`/api/files?assignmentId=${assignmentId}`);

      const data = await response.json();

      setFiles(data);
    } catch {
      setError("Failed to load files.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchFiles();
  }, [assignmentId]);

  async function handleUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) return;

    setUploading(true);
    setError("");

    try {
      const formData = new FormData();

      formData.append("file", file);
      formData.append("assignmentId", assignmentId);

      const response = await fetch("/api/files", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      await fetchFiles();
    } catch (error) {
      setError(error instanceof Error ? error.message : "Upload failed.");
    } finally {
      setUploading(false);

      // Allows uploading the same file again later
      event.target.value = "";
    }
  }

  function getFileType(mimeType: string) {
    switch (mimeType) {
      case "application/pdf":
        return "PDF";

      case "application/vnd.ms-powerpoint":
        return "PowerPoint";

      case "application/vnd.openxmlformats-officedocument.presentationml.presentation":
        return "PowerPoint";

      case "application/msword":
        return "Word";

      case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        return "Word";

      case "image/png":
        return "PNG Image";

      case "image/jpeg":
        return "JPEG Image";

      default:
        return "File";
    }
  }
  async function handleOpen(file: DriveFile) {
    const response = await fetch(
      `/api/files/open?driveFileId=${file.driveFileId}`,
    );

    const data = await response.json();

    window.open(data.webViewLink, "_blank");
  }

  async function handleDelete(file: DriveFile) {
    const confirmed = window.confirm(`Delete "${file.fileName}"?`);

    if (!confirmed) return;
    setDeletingIds((prev) => [...prev, file._id]);

    try {
      const response = await fetch(`/api/files/${file._id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete file");
      }

      await fetchFiles();
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to delete file.",
      );
    } finally {
      setDeletingIds((prev) => prev.filter((id) => id !== file._id));
    }
  }

  async function handleDownload(file: DriveFile) {
    try {
      const response = await fetch(`/api/files/download/${file._id}`);

      if (!response.ok) {
        throw new Error("Failed to download file");
      }

      const data = await response.json();

      window.open(data.downloadUrl, "_blank");
    } catch (error) {
      setError(error instanceof Error ? error.message : "Download failed.");
    }
  }

  return (
    <div className="space-y-4">
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        onChange={handleUpload}
      />

      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        disabled={uploading}
        className="rounded-xl bg-slate-900 px-4 py-2 text-white disabled:opacity-50"
      >
        {uploading ? "Uploading..." : "Upload File"}
      </button>

      {error && <p className="text-sm text-red-600">{error}</p>}

      {loading ? (
        <p>Loading files...</p>
      ) : files.length === 0 ? (
        <p>No files uploaded yet.</p>
      ) : (
        <div className="space-y-2">
          {files.map((file) => (
            <FileCard
              key={file._id}
              file={file}
              onOpen={handleOpen}
              onDelete={handleDelete}
              onDownload={handleDownload}
              isDeleting={deletingIds.includes(file._id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
