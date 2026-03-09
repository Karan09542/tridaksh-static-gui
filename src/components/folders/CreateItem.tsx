import { useState, useRef, useEffect } from "react";
import { FilePlus, FolderPlus, X } from "lucide-react";

interface CreateItemProps {
  type: "file" | "dir";
  onCreate: (name: string, type: "file" | "dir") => void;
  onCancel?: () => void;
  focused?: boolean;
}

const CreateItem: React.FC<CreateItemProps> = ({ type, onCreate, onCancel, focused }) => {
  const [name, setName] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if(!focused) return
    inputRef.current?.focus();
  }, [focused]);

  const handleCreate = () => {
    const value = name.trim();
    if (!value) return;

    onCreate(value, type);
    setName("");
  };

  const handleCancel = () => {
    setName("");
    onCancel?.();
  };

  const placeholder =
    type === "file" ? "New file name..." : "New folder name...";

  return (
    <div
      className="
      flex items-center gap-2
      px-3 py-2
      bg-gray-50 dark:bg-gray-900
      border border-gray-200 dark:border-gray-800
      rounded-md
      text-sm
      "
    >
      {type === "file" ? (
        <FilePlus size={16} className="text-gray-500" />
      ) : (
        <FolderPlus size={16} className="text-gray-500" />
      )}

      <input
        ref={inputRef}
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder={placeholder}
        onKeyDown={(e) => {
          if (e.key === "Enter") handleCreate();
          if (e.key === "Escape") onCancel?.();
        }}
        className="
        flex-1
        bg-transparent
        outline-none
        text-gray-800 dark:text-gray-200
        placeholder:text-gray-400
      "
      />

      <button
        onClick={handleCreate}
        className="
        px-2 py-1
        rounded
        text-xs
        bg-orange-500
        text-white
        hover:bg-orange-600
      "
      >
        Create
      </button>

      <button
        onClick={handleCancel}
        className="
        p-1
        rounded
        hover:bg-gray-200 dark:hover:bg-gray-800
      "
      >
        <X size={14} />
      </button>
    </div>
  );
};

export default CreateItem;