import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import MainLayout from "./components/layout/MainLayout";
import { ThemeProvider } from "./context/ThemeContext";
import { AppContextProvider } from "./context/AppContext";
import Home from "./pages/Home";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import "prismjs/themes/prism.css";
import "prismjs/themes/prism-tomorrow.css";
import { lazy } from "react";
import { joinPath, route } from "./lib";

const Folders = lazy(() => import("./pages/Folders"));
const Search = lazy(() => import("./pages/Search"));

const ImageEditorPage = lazy(() => import("./pages/ImageEditorPage"));
const TextEditor = lazy(() => import("./components/TextEditor"));
const NotFound = lazy(() => import("./NotFound"));


function App() {
  return (
    <AppContextProvider>
      <ThemeProvider>
        <ToastContainer
          position="bottom-right"
          autoClose={3000}
          hideProgressBar
          newestOnTop
          closeOnClick
          pauseOnHover
          draggable
          theme="colored"
          toastClassName="fs-toast"
          className="fs-toast-container"
        />
        <BrowserRouter>
          <Routes>
            <Route element={<MainLayout />}>
              <Route path={joinPath(route, "/")} element={<Home />} />
              <Route path={joinPath(route, "/folders/*")} element={<Folders />} />
              <Route path={joinPath(route, "/search")} element={<Search />} />
              <Route path={joinPath(route, "/image-editor")} element={<ImageEditorPage />} />
              <Route path={joinPath(route, "/text-editor")} element={<TextEditor />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </AppContextProvider>
  );
}

export default App;
