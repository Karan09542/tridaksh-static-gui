import React from "react";
import { useEffect, useState } from "react";
import {  getApiEndpoint, joinPath, route } from "../lib";
import { useNavigate, useParams } from "react-router-dom";
import Breadcrumb from "../components/Breadcrumb";
import Files from "../components/folders/Files";
import Loader from "../components/Loader";
import { useAppContext } from "../context/AppContext";
import CreateItem from "../components/folders/CreateItem";
import CreateDropdown from "../components/folders/CreateDropdown";
import { toast } from "react-toastify";

const Folders: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const { "*": splat = "/" } = useParams();
  const navigate = useNavigate();
  const { files, setFiles } = useAppContext();
  const endpoint = getApiEndpoint(splat, "/ls");

  useEffect(() => {
    setLoading(true);
    fetch(endpoint)
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
  }, [splat]);

  const handleCreateFiles = async (name: string, type: "file" | "dir") => {
    const endpoint = getApiEndpoint(splat, name) + `?create=${type}`;
    const res = await fetch(endpoint);
    if (!res.ok) {
      toast.error(res.statusText);
      return;
    }

    const data = await res.json();
    toast.success(data.message);

    setFiles((prev) => [ type === "dir" ? name + "/" : name, ...prev]);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Path + Navigation Bar */}
      <div
        className="
          px-6 py-4
          border-b border-gray-200 dark:border-gray-800
          bg-white dark:bg-gray-950
          transition-colors duration-300
        "
      >
        {/* Breadcrumb Path */}
        <div className="flex items-center justify-between">
          <Breadcrumb splat={splat || ""} home={joinPath(route, "/folders/")} />
          {!splat.startsWith("/search") && (
            <CreateDropdown>
              <CreateItem type="file" focused onCreate={handleCreateFiles} />
              <CreateItem type="dir" onCreate={handleCreateFiles} />
            </CreateDropdown>
          )}
        </div>
      </div>
      {/* Content Area */}
      <div
        className="
      @container
      flex-1 overflow-auto
      bg-white dark:bg-gray-950
      transition-colors duration-300
    "
      >
        {/* Loading State */}
        {loading ? (
          <Loader />
        ) : (
          /* Files Grid */
          <Files basename={""} files={files} />
        )}
      </div>
    </div>
  );
};

export default Folders;
