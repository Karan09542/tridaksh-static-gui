import React, { useEffect, useState } from "react";
import Breadcrumb from "../components/Breadcrumb";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getApiEndpoint, joinPath, route } from "../lib";
import Files from "../components/folders/Files";
import { useAppContext } from "../context/AppContext";
import Loader from "../components/Loader";

const Search: React.FC = () => {
  const [files, setFiles] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const search = searchParams.get("search")?.trim() || "";
  const navigate = useNavigate();
  const { isSearchAgain } = useAppContext();
  async function handleSearch() {
    setLoading(true);
    const endpoint = getApiEndpoint("/", "ls");
    fetch(endpoint + (search ? `?search=${encodeURIComponent(search)}` : ""))
      .then((res) => {
        if (!res.ok || res.status === 404) {
          navigate("/not-found");
          throw new Error(res.statusText);
        }
        return res.text();
      })
      .then((data) => {
        const files = data.trim().split("\n").filter(Boolean);
        setFiles(files);
      })
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    if (!search) navigate(joinPath(route, "/folders/"));
    handleSearch();
  }, [isSearchAgain]);

  return (
    <div className="flex flex-col h-full">

      {/* Header */}
      <div
        className="
        px-6 py-4
        border-b border-gray-200 dark:border-gray-800
        bg-white dark:bg-gray-950
        transition-colors duration-300
      "
      >
        <Breadcrumb splat={""} home={joinPath(route, "/search/")} />
      </div>

      {/* Content Area */}
      <div
        className="
      flex-1 overflow-auto
      bg-white dark:bg-gray-950
      transition-colors duration-300
    ">

        {/* Loading State */}
        {loading ? (
          <Loader />
        ) : files.length === 0 ? (

          /* Empty State */
          <div className="
          flex flex-col items-center justify-center
          h-full
          text-gray-500 dark:text-gray-400
        ">
            <p className="text-sm font-medium">
              No data found
            </p>
            <p className="text-xs mt-2 text-gray-400 dark:text-gray-600">
              Try adjusting your search.
            </p>
          </div>

        ) : (

          /* Files Grid */
          <Files basename={""} files={files} />

        )}
      </div>
    </div>
  );
};

export default Search;
