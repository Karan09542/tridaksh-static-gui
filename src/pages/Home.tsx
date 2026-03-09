import React from "react";
import { Link } from "react-router-dom";
import { joinPath, route } from "../lib";

const Home: React.FC = () => {
  return (
    <div className="h-full flex items-center justify-center px-6">
      <div className="w-full max-w-xl space-y-8 text-center">
        {/* Title */}
        <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">
          <span className="text-orange-500">Static Server</span>{" "}
          <span className="text-gray-800 dark:text-gray-200">
            File Explorer
          </span>
        </h2>

        {/* Description */}
        <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
          Browse folders or search files from your static directory.
        </p>

        {/* Navigation Section */}
        <div className="flex justify-center gap-6 pt-4">
          <Link
            to={joinPath(route, "/folders")}
            className="
              text-sm font-medium
              text-orange-600 dark:text-orange-400
              hover:underline
            "
          >
            → Browse Folders
          </Link>

          <Link
            to={joinPath(route, "/search")}
            className="
              text-sm font-medium
              text-orange-600 dark:text-orange-400
              hover:underline
            "
          >
            → Search Files
          </Link>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 dark:border-gray-800 pt-6">
          <p className="text-xs text-gray-500 dark:text-gray-600">
            Lightweight • Fast • Developer Friendly
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;