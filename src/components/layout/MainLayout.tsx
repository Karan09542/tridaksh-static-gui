import { Outlet } from "react-router-dom";
import { X, Info } from "lucide-react";
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import ThemeToggle from "../button/ThemeToggle";
import { useAppContext } from "../../context/AppContext";
import SearchBar from "../SearchBar";
import Loader from "../Loader";
import "tui-color-picker/dist/tui-color-picker.css";
import "tui-color-picker/dist/tui-color-picker.js"; 
import { getApiEndpoint, joinPath, route } from "../../lib";

const FileStatView = ({ fileStat, loadingFileStat }: any) => {
  return loadingFileStat ? (
    <Loader />
  ) : !fileStat ? (
    <p className="text-sm text-gray-600 dark:text-gray-400">
      Select a file to view its metadata.
    </p>
  ) : (
    <div className="space-y-6 text-sm">
      {/* File Name */}
      <div>
        <p className="text-xs text-gray-500 dark:text-gray-500 uppercase tracking-wide">
          Name
        </p>
        <p className="mt-1 font-medium text-gray-900 dark:text-white break-all">
          {fileStat.name}
        </p>
      </div>

      {/* Type */}
      <div>
        <p className="text-xs text-gray-500 dark:text-gray-500 uppercase tracking-wide">
          Type
        </p>
        <p className="mt-1 text-gray-800 dark:text-gray-300">{fileStat.type}</p>
      </div>

      {/* Size */}
      {fileStat.type !== "Directory" && <div>
        <p className="text-xs text-gray-500 dark:text-gray-500 uppercase tracking-wide">
          Size
        </p>
        <p className="mt-1 text-gray-800 dark:text-gray-300">{fileStat.size}</p>
        <p className="text-xs text-gray-400 dark:text-gray-600">
          {fileStat.sizeInBytes.toLocaleString()} bytes
        </p>
      </div>}

      {/* Divider */}
      <div className="border-t border-gray-200 dark:border-gray-800" />

      {/* Timestamps */}
      <div className="space-y-4">
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-500 uppercase tracking-wide">
            Created
          </p>
          <p className="mt-1 text-gray-800 dark:text-gray-300">
            {fileStat.createdAt}
          </p>
        </div>

        <div>
          <p className="text-xs text-gray-500 dark:text-gray-500 uppercase tracking-wide">
            Modified
          </p>
          <p className="mt-1 text-gray-800 dark:text-gray-300">
            {fileStat.modifiedAt}
          </p>
        </div>

        <div>
          <p className="text-xs text-gray-500 dark:text-gray-500 uppercase tracking-wide">
            Last Accessed
          </p>
          <p className="mt-1 text-gray-800 dark:text-gray-300">
            {fileStat.lastAccessed}
          </p>
        </div>
      </div>
    </div>
  );
};

const HeaderButtons = ({ isDetailsOpen, setIsDetailsOpen, className }: any) => {
  return (
    <div className={`${className} flex items-center gap-3 justify-end`}>
      <ThemeToggle />

      <button
        onClick={() => setIsDetailsOpen(!isDetailsOpen)}
        className="
              p-2 rounded-md
              hover:bg-gray-200 dark:hover:bg-gray-800
              transition
            "
      >
        <Info size={18} color={isDetailsOpen ? "#ff6900" : "gray"} />
      </button>
    </div>
  );
};

const MainLayout: React.FC = () => {
  const [search, setSearch] = useState("");
  const { isDetailsOpen, setIsDetailsOpen, sm, md, selectedFile } =
    useAppContext();
  const [fileStat, setFileStat] = useState(null);
  const [loadingFileStat, setLoadingFileStat] = useState(false);

  async function fetchFileStat(file: string) {
    setLoadingFileStat(true);
    const endpoint = getApiEndpoint("", file) + "?info=true";
    const res = await fetch(endpoint);
    if (!res.ok) {
      setLoadingFileStat(false);
      return;
    }
    const data = await res.json();
    setFileStat(data);
    setLoadingFileStat(false);
  }
  useEffect(() => {
    if (selectedFile) {
      fetchFileStat(selectedFile);
    } else {
      setFileStat(null);
    }
  }, [selectedFile]);

  return (
    <div
      className="
      h-screen
      overflow-hidden
      bg-white dark:bg-gray-950
      text-gray-800 dark:text-gray-200
      flex flex-col
      transition-colors duration-300
    "
    >
      {/* HEADER */}
      <header
        className="
        flex flex-col md:flex-row md:items-center md:justify-between
        gap-3 px-4 md:px-6 py-3
        border-b border-gray-200 dark:border-gray-800
        bg-white dark:bg-gray-950
      "
      >
        <div className="flex justify-between items-center gap-4">
          <h1
            className="text-sm tracking-wide text-gray-600 dark:text-gray-400 font-medium"
          >
            <NavLink
              to={joinPath(route, "/")}
              className={({ isActive }) =>
                isActive ? "text-orange-400 font-semibold" : "text-gray-600"
              }
            >
              Static Server — File Explorer
            </NavLink>
          </h1>
          {/* Navigation Links */}
          <nav className="flex gap-4">
            <NavLink
              to={joinPath(route, "/folders")}
              className={({ isActive }) =>
                isActive ? "text-blue-600 font-semibold" : "text-gray-600"
              }
            >
              Folders
            </NavLink>

            <NavLink
              to={joinPath(route, "/search")}
              className={({ isActive }) =>
                isActive ? "text-blue-600 font-semibold" : "text-gray-600"
              }
            >
              Search
            </NavLink>
          </nav>
          {(sm || md) && (
            <HeaderButtons
              isDetailsOpen={isDetailsOpen}
              setIsDetailsOpen={setIsDetailsOpen}
            />
          )}
        </div>

        <SearchBar search={search} setSearch={setSearch} />
        {!sm && !md && (
          <HeaderButtons
            isDetailsOpen={isDetailsOpen}
            setIsDetailsOpen={setIsDetailsOpen}
          />
        )}
      </header>

      {/* MAIN AREA */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* FILES */}
        <div
          className="
          flex-1 overflow-auto
          md:border-r border-gray-200 dark:border-gray-800
        "
        >
          <Outlet />
        </div>

        {/* DESKTOP DETAILS PANEL */}
        <div
          className={`
            hidden md:block
            overflow-hidden
            bg-gray-100 dark:bg-gray-900/40
            border-l border-gray-200 dark:border-gray-800
            transition-all duration-300
            ${isDetailsOpen ? "w-[320px]" : "w-0"}
          `}
        >
          {isDetailsOpen && (
            <div id="details" className="p-6">
              <h2 className="text-xs uppercase tracking-widest text-orange-500 mb-4">
                File Details
              </h2>

              <FileStatView fileStat={fileStat} loadingFileStat={loadingFileStat} />
            </div>
          )}
        </div>

        {/* MOBILE SLIDE-OVER DETAILS */}
        {isDetailsOpen && (
          <div
            id="details"
            className="
            md:hidden absolute inset-0
            bg-black/40 dark:bg-black/50
            backdrop-blur-sm
            flex justify-end z-50
          "
          >
            <div
              className="
              w-80 max-w-full
              bg-white dark:bg-gray-900
              border-l border-gray-200 dark:border-gray-800
              h-full p-6
              animate-slideIn
            "
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xs uppercase tracking-widest text-orange-500">
                  File Details
                </h2>

                <button
                  onClick={() => setIsDetailsOpen(false)}
                  className="
                    p-2 rounded-md
                    hover:bg-gray-200 dark:hover:bg-gray-800
                  "
                >
                  <X size={18} />
                </button>
              </div>

              <FileStatView fileStat={fileStat} loadingFileStat={loadingFileStat} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MainLayout;
