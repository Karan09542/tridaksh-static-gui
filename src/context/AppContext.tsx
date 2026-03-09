import React, { createContext, useContext, useEffect, useState } from "react";

type AppContextType = {
  isMobile: boolean;
  isDetailsOpen: boolean;
  setIsDetailsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  sm: boolean;
  md: boolean;
  lg: boolean;
  isSearchAgain: boolean;
  searchAgain: () => void;
  selectedFile: string | null;
  selectFile: (file: string | null) => void;
  files: string[];
  setFiles: React.Dispatch<React.SetStateAction<string[]>>;
};
interface AppContextProviderProps {
  children: React.ReactNode;
}

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within a AppContextProvider");
  }
  return context;
};
export const AppContext = createContext<AppContextType | null>(null);
export const AppContextProvider: React.FC<AppContextProviderProps> = ({
  children,
}) => {
  const isMobile = () =>
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/.test(
      navigator.userAgent,
    );
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [sm, setSm] = useState(false);
  const [md, setMd] = useState(false);
  const [lg, setLg] = useState(false);

  const [isSearchAgain, setIsSearchAgain] = useState(false);
  const searchAgain = () => setIsSearchAgain(prev => !prev);

  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const selectFile = (file: string | null) => setSelectedFile(file);

  const [files, setFiles] = useState<string[]>([]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setSm(true);
        setMd(false);
        setLg(false);
      } else if (window.innerWidth < 768) {
        setSm(false);
        setMd(true);
        setLg(false);
      } else {
        setSm(false);
        setMd(false);
        setLg(true);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <AppContext.Provider
      value={{
        isMobile: isMobile(),
        isDetailsOpen,
        setIsDetailsOpen,
        sm,
        md,
        lg,
        isSearchAgain,
        searchAgain,
        selectedFile,
        selectFile,
        files,
        setFiles,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
