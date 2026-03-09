import { useEffect, useState } from "react";
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  X,
  Download,
  TextWrap,
  Code,
  Edit,
  RefreshCcw,
} from "lucide-react";

import Prism from "../../lib/prism";
import { Link } from "react-router-dom";
import {
  AUDIO_EXTENSIONS,
  createEditorUrl,
  IMAGE_EXT,
  MARKDOWN_EXT,
  VIDEO_EXTENSIONS,
} from "../../lib";
import Markdown from "../Markdown";
import ThemeToggle from "../button/ThemeToggle";
import { useTheme } from "../../context/ThemeContext";

interface FileViewerProps {
  url: string;
  fileName: string;
  onClose: () => void;
  onDownload: (e: React.MouseEvent) => void;
}

const languageMap: Record<string, string> = {
  js: "javascript",
  jsx: "jsx",
  ts: "typescript",
  tsx: "tsx",
  json: "json",
  html: "markup",
  css: "css",
  yml: "yaml",
  yaml: "yaml",
};

const FileViewer: React.FC<FileViewerProps> = ({
  url,
  fileName,
  onClose,
  onDownload,
}) => {
  const [refetch, setRefetch] = useState(false);
  const [type, setType] = useState<
    "image" | "text" | "markdown" | "video" | "audio" | "pdf" | "other"
  >("other");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [zoom, setZoom] = useState(1);

  const [isTextWrap, setIsTextWrap] = useState(false);
  const [isHighlight, setIsHighlight] = useState(true);
  const [isMarkdownRender, setIsMarkdownRender] = useState(true);
  const { theme } = useTheme()

  const ext = fileName.split(".").pop()?.toLowerCase();

  const channel  = new BroadcastChannel("editor");

  channel.onmessage = (e) => {
    if (e.data === "refresh") {
      setRefetch(!refetch);
    }
  };

  useEffect(() => {
    setLoading(true);

    if (ext && IMAGE_EXT.includes(ext)) {
      setType("image");
      setLoading(false);
      return;
    }

    if (ext && VIDEO_EXTENSIONS.includes(ext)) {
      setType("video");
      setLoading(false);
      return;
    }

    if (ext && AUDIO_EXTENSIONS.includes(ext)) {
      setType("audio");
      setLoading(false);
      return;
    }

    if (["pdf"].includes(ext || "")) {
      setType("pdf");
      setLoading(false);
      setType("pdf");
      return;
    }

    if (ext && MARKDOWN_EXT.includes(ext)) {
      setType("markdown");
    } else {
      setType("text");
    }

    fetch(url)
      .then((r) => r.text())
      .then((text) => {
        setContent(text);
        setLoading(false);
      });
  }, [url, fileName, refetch]);

  useEffect(() => {
    if (isHighlight) {
      Prism.highlightAll();
    }
  }, [content, isHighlight, isTextWrap, refetch, theme]);

  const zoomIn = () => setZoom((z) => Math.min(z + 0.25, 5));
  const zoomOut = () => setZoom((z) => Math.max(z - 0.25, 0.25));
  const resetZoom = () => setZoom(1);

  const handleWheel = (e: React.WheelEvent) => {
    if (type !== "image") return;

    if (e.deltaY < 0) zoomIn();
    else zoomOut();
  };

  const lines = content.split("\n");

  const language = languageMap[ext || ""] || "markup";

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-white dark:bg-gray-950">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-gray-200 dark:border-gray-800 text-sm text-gray-700 dark:text-gray-300">
        <span className="truncate">{fileName}</span>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <RefreshCcw
            onClick={() => setRefetch((r) => !r)}
            className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-900"
          />
          {type === "image" && (
            <>
              <button
                onClick={zoomOut}
                className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-900"
              >
                <ZoomOut size={16} />
              </button>

              <button
                onClick={zoomIn}
                className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-900"
              >
                <ZoomIn size={16} />
              </button>

              <button
                onClick={resetZoom}
                className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-900"
              >
                <RotateCcw size={16} />
              </button>
              <Link
                to={createEditorUrl("image", url, fileName)}
                target="_blank"
                className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-900"
              >
                <Edit size={16} />
              </Link>
            </>
          )}

          {(type === "text" || type === "markdown") && (
            <>
              <button
                onClick={() => setIsTextWrap(!isTextWrap)}
                className={`${isTextWrap ? "text-orange-500" : ""} p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-900`}
              >
                <TextWrap size={16} />
              </button>

              {type === "text" && (
                <button
                  onClick={() => setIsHighlight((v) => !v)}
                  className={`${isHighlight ? "text-orange-500" : ""} p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-900`}
                  title="Toggle Syntax Highlight"
                >
                  <Code size={16} />
                </button>
              )}

              {type === "markdown" && (
                <button
                  onClick={() => setIsMarkdownRender((v) => !v)}
                  className={`${isMarkdownRender ? "text-orange-500" : ""} p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-900`}
                  title="Toggle Markdown Render"
                >
                  <Code size={16} />
                </button>
              )}

              <Link
                to={createEditorUrl("text", url, fileName)}
                target="_blank"
                className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-900"
              >
                <Edit size={16} />
              </Link>

            </>
          )}

          <button
            onClick={onDownload}
            className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-900"
          >
            <Download size={16} />
          </button>

          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-900"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Viewer */}
      <div className="flex-1 overflow-auto p-4" onWheel={handleWheel}>
        {loading && (
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Loading preview...
          </div>
        )}

        {/* IMAGE */}
        {!loading && type === "image" && (
          <div className="flex items-center justify-center h-full">
            <img
              src={url}
              alt={fileName}
              style={{ transform: `scale(${zoom})` }}
              className="max-h-full max-w-full object-contain transition-transform"
            />
          </div>
        )}

        {/* MARKDOWN */}
        {!loading && type === "markdown" && isMarkdownRender && (
          <Markdown content={content} />
        )}

        {/* VIDEO */}
        {!loading && type === "video" && (
          <div className="flex items-center justify-center h-full">
            <video
              src={url + "?show=true"}
              controls
              className="max-h-full max-w-full object-contain"
            />
          </div>
        )}

        {/* AUDIO */}
        {!loading && type === "audio" && (
          <div className="flex items-center justify-center h-full">
            <audio
              src={url + "?show=true"}
              controls
              className="max-h-full max-w-full object-contain"
            />
          </div>
        )}

        {/* PDF */}
        {!loading && type === "pdf" && (
          <iframe
            src={url + "?show=true"}
            className="w-full h-full border-0"
            title={fileName}
            allowFullScreen
          />

        )}

        {/* TEXT / RAW */}
        {!loading && (type === "text" || !isMarkdownRender) && (
          <div className="font-mono text-sm leading-relaxed">
            <div className="flex">
              <div className="text-right pr-4 select-none text-gray-400 dark:text-gray-600">
                {lines.map((_, i) => (
                  <div key={i}>{i + 1}</div>
                ))}
              </div>

              <pre
                className={`
                  ${isTextWrap ? "whitespace-pre-wrap wrap-break-words" : "whitespace-pre"}
                  w-full pr-4 text-gray-800 dark:text-gray-200
                `}
              >
                {isHighlight ? (
                  <code className={`language-${language}`}>{content}</code>
                ) : (
                  content
                )}
              </pre>
            </div>
          </div>
        )}

        {!loading && type === "other" && (
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Preview not supported for this file type.
          </div>
        )}
      </div>
    </div>
  );
};

export default FileViewer;
