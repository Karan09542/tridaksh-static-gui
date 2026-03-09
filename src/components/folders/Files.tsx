import React from "react";
import { FolderOpen } from "lucide-react";
import FileCard from "./FileCard";

interface FilesProps {
  basename: string;
  files: string[];
}
const Files: React.FC<FilesProps> = ({ basename, files }) => {
  const validFiles = files.filter(Boolean);

  if (validFiles.length === 0) {
    return (
      <div
        className="
        flex flex-col items-center justify-center
        h-full
        text-gray-500 dark:text-gray-500
        py-20
      "
      >
        <FolderOpen size={48} className="mb-4 opacity-60" />
        <p className="text-sm">This directory is empty</p>
        <p className="text-xs mt-2 text-gray-400 dark:text-gray-600">
          No files or folders found.
        </p>
      </div>
    );
  }

  return (
    <div
      id="file-container"
      className="
        grid
        grid-cols-2
        @max-[800px]:grid-cols-3
        sm:grid-cols-4
        md:grid-cols-6
        lg:grid-cols-8
        gap-x-8
        gap-y-10
        px-6 py-8
      "
    >
      {validFiles.map((file) => (
        <FileCard key={file} basename={basename}  fileName={file} />
      ))}
    </div>
  );
};

export default Files;
