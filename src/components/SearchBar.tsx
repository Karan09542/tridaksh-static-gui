import { Search, X } from "lucide-react";
import { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import { joinPath, route } from "../lib";

interface SearchBarProps {
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  className?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ search, setSearch }) => {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const searchUrl = joinPath(route, "/search/") + `?search=${search}`;
  const { searchAgain } = useAppContext();

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSearch("");
        inputRef.current?.blur();
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [setSearch]);


  // get search from url
  useEffect(() => {
    const search = searchParams.get("search")?.trim() || "";
    if (search) {
      setSearch(search);
    }
  }, [])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && search.trim()) {
      navigate(searchUrl);
      searchAgain()
      inputRef.current?.blur();
    }
  };

  return (
    <div className="relative w-full md:w-80 group">
      <Search
        size={16}
        onClick={() => {
          if (search.trim()) {
            navigate(searchUrl);
            searchAgain()
            inputRef.current?.blur();
          }
        }}
        className="
          absolute left-3 top-1/2 -translate-y-1/2
          text-gray-400 dark:text-gray-500
          group-focus-within:text-orange-500
          transition
        "
      />

      <input
        ref={inputRef}
        type="text"
        value={search}
        onChange={(e) => {
          const value = e.target.value;
          setSearch(value);
          setSearchParams({ search: value });
        }}
        onKeyDown={handleKeyDown}
        placeholder="Search files..."
        className="
          w-full
          bg-gray-100 dark:bg-gray-900
          border border-gray-300 dark:border-gray-800
          text-sm
          text-gray-800 dark:text-gray-200
          pl-9 pr-9 py-2
          rounded-md
          focus:outline-none
          focus:border-orange-500
          focus:ring-1
          focus:ring-orange-500
          transition
          placeholder:text-gray-400 dark:placeholder:text-gray-600
        "
      />

      {search && (
        <button
          onClick={() => {
            setSearch("");
            setSearchParams({ search: "" });
          }}
          className="
            absolute right-3 top-1/2 -translate-y-1/2
            text-gray-400 dark:text-gray-500
            hover:text-orange-500
            transition
          "
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
};

export default SearchBar;
