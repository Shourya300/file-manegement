import { DriveFile } from "../types/fileTypes";
import { FileText, MoreVertical } from "lucide-react";

interface FileCardProps {
  file: DriveFile;
  onOpen: (file: DriveFile) => void;
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
export default function FileCard({ file, onOpen }: FileCardProps) {
  return (
    <div
      onClick={() => onOpen(file)}
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
            {" * "}
            {formatDate(file.uploadedAt)}
          </p>
        </div>
      </div>

      <div className="opacity-0 transition-opacity duration-200 group-hover:opacity-100">
        <button
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <MoreVertical size={18} />
        </button>
      </div>
    </div>
  );
}
