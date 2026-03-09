import { useState, useRef, useLayoutEffect } from "react";
import { Plus } from "lucide-react";
import useOutsideClose from "../../hooks/useOutsideClose";

interface CreateDropdownProps {
  children: React.ReactNode;
}

const CreateDropdown: React.FC<CreateDropdownProps> = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [placement, setPlacement] = useState("bottom-left");

  const triggerRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!open) return;

    const trigger = triggerRef.current;
    const dropdown = dropdownRef.current;

    if (!trigger || !dropdown) return;

    const rect = trigger.getBoundingClientRect();

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    const dropdownWidth = dropdown.offsetWidth || 200;
    const dropdownHeight = dropdown.offsetHeight || 200;

    const spaceBottom = viewportHeight - rect.bottom;
    const spaceTop = rect.top;

    const spaceRight = viewportWidth - rect.left;
    const spaceLeft = rect.right;

    let newPlacement = "bottom-left";

    if (spaceBottom < dropdownHeight && spaceTop > dropdownHeight) {
      newPlacement = "top-left";
    }

    if (spaceRight < dropdownWidth && spaceLeft > dropdownWidth) {
      newPlacement = newPlacement === "top-left" ? "top-right" : "bottom-right";
    }

    setPlacement(newPlacement);
  }, [open]);

  const placementClasses: Record<string, string> = {
    "bottom-left": "top-full left-0 mt-2",
    "bottom-right": "top-full right-0 mt-2",
    "top-left": "bottom-full left-0 mb-2",
    "top-right": "bottom-full right-0 mb-2",
  };
  useOutsideClose({ ref: dropdownRef, setState: setOpen });
  return (
    <div className="relative inline-block">
      <button
        ref={triggerRef}
        onClick={() => setOpen((v) => !v)}
        className="
        flex items-center gap-1
        px-2 py-1
        text-sm
        rounded
        hover:bg-gray-100 dark:hover:bg-gray-800
      "
      >
        <Plus size={16} />
        Create
      </button>

      {open && (
        <div
          ref={dropdownRef}
          className={`
          absolute
          flex flex-col gap-2
          ${placementClasses[placement]}
          min-w-[200px]
          bg-white dark:bg-gray-900
          border border-gray-200 dark:border-gray-800
          rounded-md
          shadow-lg
          z-50
          p-2
        `}
        >
          {children}
        </div>
      )}
    </div>
  );
};

export default CreateDropdown;
