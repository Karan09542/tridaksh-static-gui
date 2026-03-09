import React, { useEffect, useRef, useState } from "react";
import { useAppContext } from "../../context/AppContext";
import {
  Download,
  Edit,
  FilePen,
  FolderPen,
  Info,
  MoreVertical,
  Trash2,
} from "lucide-react";
import {
  createEditorUrl,
  getApiEndpoint,
  icons,
  ICONS_EXTENSION_MAP,
  IMAGE_EXT,
  joinPath,
  route,
  TEXT_EXTENSIONS,
} from "../../lib";
import { Link, useLocation, useNavigate } from "react-router-dom";
import useOutsideClose from "../../hooks/useOutsideClose";
import { toast } from "react-toastify";

const FileViewer = React.lazy(() => import("./FileViewer"));

const removeTrailingSlash = (path: string) =>
  path.endsWith("/") ? path.slice(0, -1) : path;
const getRightIcon = (file: string) => {
  file = file.toLowerCase();
  if ([".git/"].includes(file.toLowerCase())) {
    return ICONS_EXTENSION_MAP[file.toLowerCase()];
  }
  if (file.endsWith("/")) {
    return icons.folderIcon100;
  }
  if (file === "package.json" || file === "package-lock.json") {
    return icons.nodeJsIcon100;
  }
  if (
    file.endsWith("d.ts") ||
    file.endsWith("d.cts") ||
    file.endsWith("d.mts")
  ) {
    return icons.tsOutlineIcon100;
  }
  if (file.endsWith("mjs.map") || file.endsWith("cjs.map")) {
    return icons.jsOutlineIcon100;
  }

  // for app
  if (ICONS_EXTENSION_MAP[file]) {
    return ICONS_EXTENSION_MAP[file];
  }

  if (ICONS_EXTENSION_MAP[file.split(".").pop()!]) {
    return ICONS_EXTENSION_MAP[file.split(".").pop()!];
  }
  return icons.documentIcon100;
};

interface FileCardProps {
  fileName: string;
  basename?: string;
}
const FileCard: React.FC<FileCardProps> = ({ fileName }) => {
  const navigate = useNavigate();
  const [openMenu, setOpenMenu] = useState(false);
  const [imageError, setImageError] = useState(false);
  const fileRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // rename
  const inputRef = useRef<HTMLInputElement>(null);
  const [isRename, setIsRename] = useState(false);
  const [renameValue, setRenameValue] = useState(
    removeTrailingSlash(fileName).split("/").pop() || "",
  );
  // open viewer
  const [isViewerOpen, setIsViewerOpen] = useState(false);

  const { isMobile, setIsDetailsOpen, selectedFile, selectFile, setFiles } =
    useAppContext();
  const pathname = useLocation().pathname;

  const extension = fileName.split(".").pop()?.toLowerCase();
  const isImage = extension && IMAGE_EXT.includes(extension);
  const isFolder = fileName.endsWith("/");

  const handleFileClick = (fileName: string) => {
    if (!fileName.endsWith("/")) {
      setIsViewerOpen(true);
      return;
    }
    const nav = joinPath(route, "/folders");
    if (!pathname.startsWith(nav)) {
      navigate(joinPath(nav, fileName));
      return;
    }
    navigate(joinPath(pathname, fileName));
  };
  const API_ENDPOINT = getApiEndpoint(pathname, fileName);

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(API_ENDPOINT, "_blank");
    setOpenMenu(false);
  };

  const handleDetails = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDetailsOpen(true);
    setOpenMenu(false);
    selectFile(API_ENDPOINT);
  };

  const handleRename = async () => {
    const newName = renameValue.trim();
    const oldName = removeTrailingSlash(fileName);

    if (!newName || newName === oldName) {
      setIsRename(false);
      return;
    }

    // TODO: call your rename API here
    const endpoint = `${API_ENDPOINT}?rename=${newName}`;

    const res = await fetch(endpoint);
    if (!res.ok) {
      if (res.status === 403) {
        toast.error("You don't have permission to rename this file");
      } else {
        toast.error(res.statusText);
      }
      setRenameValue(oldName);
      return;
    }
    const data = await res.json();

    setFiles((prev) => {
      return prev.map((file) => {
        if (file === fileName) {
          return fileName.endsWith("/") ? newName + "/" : newName;
        }
        return file;
      });
    });

    toast.success(data.message);

    setRenameValue(newName);
    setIsRename(false);
  };

  useEffect(() => {
    if (isRename) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [isRename]);

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const endpoint = `${API_ENDPOINT}?delete=true`;
    const res = await fetch(endpoint, { method: "DELETE" });
    if (!res.ok) {
      toast.error(res.statusText);
      return;
    }
    const data = await res.json();
    toast.success(data.message);
    setFiles((prev) => prev.filter((file) => file !== fileName));
  };

  // Close dropdown when clicking outside
  useOutsideClose({
    ref: menuRef,
    setState: setOpenMenu,
    containerId: "file-container",
  });
  useOutsideClose({
    ref: fileRef,
    setState: selectFile,
    containerId: "file-container",
  });

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setOpenMenu(true);
  };

  return (
    <>
      {isViewerOpen && (
        <FileViewer
          url={`${API_ENDPOINT}`}
          fileName={fileName}
          onClose={() => setIsViewerOpen(false)}
          onDownload={handleDownload}
        />
      )}
      <div
        ref={fileRef}
        onDoubleClick={() => !isMobile && handleFileClick(fileName)}
        onClick={() => {
          isMobile && handleFileClick(fileName);
          isMobile && selectFile(API_ENDPOINT);
        }}
        onContextMenu={handleContextMenu}
        className={`
        group
        relative
        flex flex-col items-center
        gap-2
        px-3 py-4
        cursor-pointer
        hover:bg-gray-100 dark:hover:bg-gray-900/60
        transition
        ${selectedFile === API_ENDPOINT ? "bg-gray-100 dark:bg-gray-900/60" : ""}
      `}
      >
        {/* Three Dot Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setOpenMenu((prev) => !prev);
          }}
          className={`
          absolute top-2 right-2
          ${isMobile ? "opacity-100" : "opacity-0 group-hover:opacity-100"}
          p-1 rounded
          hover:bg-gray-200 dark:hover:bg-gray-800
          transition
        `}
        >
          <MoreVertical size={16} />
        </button>

        {/* Icon */}
        {isImage && !imageError ? (
          <img
            src={API_ENDPOINT}
            alt={fileName}
            loading="lazy"
            onError={() => setImageError(true)}
            className="
              w-14 h-14 object-contain
              transition duration-300
              group-hover:scale-110
            "
          />
        ) : (
          <img
            src={getRightIcon(fileName)}
            alt="file"
            className="w-14 h-14 object-contain"
          />
        )}

        {/* File Name */}
        {isRename ? (
          <input
            ref={inputRef}
            value={renameValue}
            onChange={(e) => setRenameValue(e.target.value)}
            onBlur={handleRename}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleRename();
              if (e.key === "Escape") setIsRename(false);
            }}
            className="
            text-sm text-center
            bg-white dark:bg-gray-900
            border border-orange-500
            rounded px-1
            w-[110px]
            outline-none
          "
          />
        ) : (
          <p
            onDoubleClick={(e) => {
              e.stopPropagation();
              setIsRename(true);
            }}
            className="
            text-sm
            text-gray-700 dark:text-gray-400
            group-hover:text-black dark:group-hover:text-white
            text-center truncate max-w-[110px]
            cursor-text
          "
            title={fileName}
          >
            {removeTrailingSlash(fileName).split("/").pop()}
          </p>
        )}

        {/* Dropdown Menu */}
        {openMenu && (
          <div
            ref={menuRef}
            className="
            absolute top-10 right-2
            w-40
            bg-white dark:bg-gray-900
            border border-gray-200 dark:border-gray-800
            rounded-md
            shadow-lg
            z-50
            py-1
            text-sm
          "
          >
            <button
              onClick={handleDownload}
              className="
              flex items-center gap-2
              w-full px-3 py-2
              hover:bg-gray-100 dark:hover:bg-gray-800
              transition
            "
            >
              <Download size={14} />
              Download
            </button>

            <button
              onClick={handleDetails}
              className="
              flex items-center gap-2
              w-full px-3 py-2
              hover:bg-gray-100 dark:hover:bg-gray-800
              transition
            "
            >
              <Info size={14} />
              View Details
            </button>
            <button
              onClick={handleDelete}
              className="
              flex items-center gap-2
              w-full px-3 py-2
              hover:bg-gray-100 dark:hover:bg-gray-800
              transition
            "
            >
              <Trash2 size={14} />
              Delete
            </button>
            <button
              onClick={() => {
                setIsRename(true);
                setOpenMenu(false);
              }}
              className="
              flex items-center gap-2
              w-full px-3 py-2
              hover:bg-gray-100 dark:hover:bg-gray-800
              transition
            "
            >
              {isFolder ? <FolderPen size={14} /> : <FilePen size={14} />}
              Rename
            </button>
            {(isImage || TEXT_EXTENSIONS.includes(extension || "")) && (
              <Link
                to={createEditorUrl(
                  isImage ? "image" : "text",
                  API_ENDPOINT,
                  fileName,
                )}
                target="_blank"
                onClick={() => {
                  setIsRename(true);
                  setOpenMenu(false);
                }}
                className="
              flex items-center gap-2
              w-full px-3 py-2
              hover:bg-gray-100 dark:hover:bg-gray-800
              transition
            "
              >
                <Edit size={14} />
                Edit
              </Link>
            )}
          </div>
        )}
      </div>
    </>
  );
};
export default FileCard;
