import { useState, useRef, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { getApiEndpoint } from "../lib";

export type TextEditorAPI = {
  getText: () => string;
  setText: (value: string) => void;
};

type Props = {
  onReady?: (api: TextEditorAPI) => void;
};

export default function TextEditor({ onReady }: Props) {
  const [searchParams] = useSearchParams();

  const path = searchParams.get("path") || "";
  const name = searchParams.get("name") || "";
  const endpoint = getApiEndpoint(path, "");

  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentLine, setCurrentLine] = useState(1);

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const lineRef = useRef<HTMLDivElement | null>(null);

  const lines = text.split("\n");

  const channel = new BroadcastChannel("editor");

  /* -----------------------------
       Provide API
    ----------------------------- */

  useEffect(() => {
    if (!onReady) return;

    onReady({
      getText: () => text,
      setText: (value: string) => setText(value),
    });
  }, [text, onReady]);

  /* -----------------------------
       Fetch file content
    ----------------------------- */

  useEffect(() => {
    if (!path || !name) return;

    const fetchFile = async () => {
      try {
        setLoading(true);
        const res = await fetch(endpoint);

        if (!res.ok) throw new Error("Failed to load file");

        const data = await res.text();

        setText(data);
      } catch (err) {
        toast.error("Failed to load file");
      } finally {
        setLoading(false);
      }
    };

    fetchFile();
  }, [path, name]);

  /* -----------------------------
       Save file
    ----------------------------- */

  const handleSave = async () => {
    try {
      const file = new File([text], name);
      const form = new FormData();
      form.append("file", file);
      const res = await fetch(`${endpoint}?update=true`, {
        method: "POST",
        body: form,
      });

      if (!res.ok) throw new Error("Save failed");
      channel.postMessage("refresh");
      toast.success("File saved successfully");
    } catch {
      toast.error("Failed to save file");
    }
  };

  /* -----------------------------
       Scroll Sync
    ----------------------------- */

  const handleScroll = () => {
    if (!textareaRef.current || !lineRef.current) return;

    lineRef.current.scrollTop = textareaRef.current.scrollTop;
  };

  /* -----------------------------
       Text Change
    ----------------------------- */

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;

    setText(value);

    const cursor = e.target.selectionStart;
    const beforeCursor = value.substring(0, cursor);

    setCurrentLine(beforeCursor.split("\n").length);
  };

  /* -----------------------------
       Tab indentation
    ----------------------------- */

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Tab") {
      e.preventDefault();

      const textarea = textareaRef.current;
      if (!textarea) return;

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;

      const newValue = text.substring(0, start) + "  " + text.substring(end);

      setText(newValue);

      requestAnimationFrame(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 2;
      });
    }

    /* Save shortcut */
    if (e.ctrlKey && e.key === "s") {
      e.preventDefault();
      handleSave();
    }
  };

  return (
    <div className="flex flex-col w-full h-full bg-white dark:bg-gray-950">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200 dark:border-gray-800">
        <span className="text-sm text-gray-600 dark:text-gray-400">{path.split("/").map(decodeURIComponent).join("/")}</span>

        <button
          type="button"
          onClick={handleSave}
          className="px-3 py-1 text-sm rounded bg-orange-500 text-white hover:bg-orange-600"
        >
          Save
        </button>
      </div>

      {/* Editor */}
      <div className="flex flex-1 overflow-hidden text-sm font-mono">
        {/* Line Numbers */}
        <div
          ref={lineRef}
          className="
          w-14
          text-right
          pr-3
          pt-3
          select-none
          text-gray-400
          dark:text-gray-600
          border-r border-gray-200 dark:border-gray-800
          bg-gray-50 dark:bg-gray-950
          overflow-hidden
        "
        >
          {lines.map((_, i) => (
            <div
              key={i}
              className={`leading-6 ${currentLine === i + 1
                  ? "text-orange-500 dark:text-orange-400"
                  : ""
                }`}
            >
              {i + 1}
            </div>
          ))}
        </div>

        {/* Textarea */}
        <textarea
          ref={textareaRef}
          value={text}
          onChange={handleChange}
          onScroll={handleScroll}
          onKeyDown={handleKeyDown}
          spellCheck={false}
          placeholder={loading ? "Loading file..." : "Start typing..."}
          className="
          flex-1
          px-4
          py-3
          leading-6
          outline-none
          resize-none
          bg-transparent
          text-gray-800 dark:text-gray-200
          caret-orange-500
          overflow-auto
        "
        />
      </div>
    </div>
  );
}
