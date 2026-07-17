import { DriveFile } from "../types/fileTypes";
import { FileText, MoreVertical } from "lucide-react";
import { useState } from "react";

interface FileCardProps {
  file: DriveFile;
  onOpen: (file: DriveFile) => void;
  onDelete: (file: DriveFile) => void;
  isDeleting?: boolean;
  onDownload: (file: DriveFile) => void;
}

function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;

  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
export default function FileCard({
  file,
  onOpen,
  onDelete,
  onDownload,
  isDeleting = false,
}: FileCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <div
      onClick={() => !isDeleting && onOpen(file)}
      className="group flex cursor-pointer items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:border-slate-300 hover:bg-slate-100"
    >
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white">
          <FileText size={18} />
        </div>

        <div>
          <h3 className="font-medium text-slate-900 ">{file.fileName}</h3>

          <p className="text-sm text-slate-500">
            {formatFileSize(file.size)}
            {" • "}
            {formatDate(file.uploadedAt)}
          </p>
        </div>
      </div>

      <div className="relative opacity-0 transition-opacity duration-200 group-hover:opacity-100">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setMenuOpen((prev) => !prev);
          }}
          className="rounded-full p-2 hover:bg-slate-200"
        >
          <MoreVertical size={18} />
        </button>

        {menuOpen && (
          <div
            className="absolute right-0 z-20 mt-2 w-40 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => {
                setMenuOpen(false);
                onDownload(file);
              }}
              className="block w-full px-4 py-2 text-left hover:bg-slate-100"
            >
              Download
            </button>

            <button
              onClick={() => {
                setMenuOpen(false);
                onDelete(file);
              }}
              disabled={isDeleting}
              className="block w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 disabled:opacity-50"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
