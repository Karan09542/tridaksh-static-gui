import React from "react";

interface LoaderProps {
  message?: string;
}
const Loader: React.FC<LoaderProps> = ({ message = "Loading files..." }) => {
  return (
    <div
      className="
          flex flex-col items-center justify-center
          h-full
          text-gray-500 dark:text-gray-400
        "
    >
      <div
        className="
            w-8 h-8
            border-2 border-gray-300 dark:border-gray-700
            border-t-orange-500
            rounded-full
            animate-spin
            mb-4
          "
      />
      <p className="text-sm">{message}</p>
    </div>
  );
};

export default Loader;
