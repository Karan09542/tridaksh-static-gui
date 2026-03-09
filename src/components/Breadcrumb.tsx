import { ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { joinPath } from "../lib";

interface BreadcrumbProps {
  splat: string;
  home: string;
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ splat, home }) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const segments = splat ? splat.split("/").filter(Boolean) : [];
  const MAX_VISIBLE = 4;

  const goTo = (index: number | null) => {
    if (index === null) {
      navigate(home);
    } else {
      const path = segments.slice(0, index + 1).join("/");
      navigate(joinPath(home, path));
    }
    setOpen(false);
  };

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const shouldCollapse = segments.length > MAX_VISIBLE;

  return (
    <div className="relative">
      {/* Scrollable breadcrumb row */}
      <div
        className="
        flex items-center gap-1
        text-sm
        overflow-x-auto
        whitespace-nowrap
        text-gray-600 dark:text-gray-400
      "
      >
        {/* ROOT (~) */}
        <button
          onClick={() => goTo(null)}
          className="
          font-medium
          text-gray-900 dark:text-white
          hover:text-orange-500
          transition
        "
        >
          ~
        </button>

        {segments.map((segment, index) => {
          if (shouldCollapse) {
            if (index > 0 && index < segments.length - 2) {
              if (index === 1) {
                return (
                  <div key="dots" className="flex items-center gap-1">
                    <ChevronRight size={14} className="opacity-50" />
                    <button
                      onClick={() => setOpen((prev) => !prev)}
                      className="px-1 hover:text-orange-500 transition"
                    >
                      ...
                    </button>
                  </div>
                );
              }
              return null;
            }
          }

          return (
            <div key={index} className="flex items-center gap-1">
              <ChevronRight size={14} className="opacity-50" />
              <button
                onClick={() => goTo(index)}
                className="
                font-medium
                text-gray-900 dark:text-white
                hover:text-orange-500
                transition
              "
              >
                {segment}
              </button>
            </div>
          );
        })}
      </div>

      {/* Dropdown OUTSIDE scroll container */}
      {open && (
        <div
          ref={dropdownRef}
          className="
          absolute top-full left-8 mt-2
          bg-white dark:bg-gray-900
          border border-gray-200 dark:border-gray-800
          rounded-md shadow-lg
          py-1 z-100
          min-w-40
        "
        >
          {segments.slice(1, segments.length - 2).map((seg, i) => (
            <button
              key={i}
              onClick={() => goTo(i + 1)}
              className="
              block w-full text-left
              px-3 py-2 text-sm
              hover:bg-gray-100 dark:hover:bg-gray-800
              transition
            "
            >
              {seg}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Breadcrumb;
