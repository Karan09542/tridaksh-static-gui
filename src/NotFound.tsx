import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { joinPath, route } from "./lib";

export default function NotFound() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const layers = document.querySelectorAll(
        ".parallax-layer",
      ) as NodeListOf<HTMLElement>;
      const x = (window.innerWidth - e.pageX) / 100;
      const y = (window.innerHeight - e.pageY) / 100;
      layers.forEach((layer, index) => {
        const depth = (index + 1) * 10;
        layer.style.transform = `translateX(${x / depth}px) translateY(${y / depth}px)`;
        layer.style.transition = `transform 0.2s ease-in-out ${index * 0.1}s`;
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

return (
  <div className="
    relative min-h-screen overflow-hidden
    bg-white dark:bg-gray-950
    text-gray-900 dark:text-white
    flex flex-col justify-center items-center
    px-6 transition-colors duration-300
  ">
    {/* Background Parallax Layers */}
    <div className="absolute inset-0">
      <div className="
        parallax-layer absolute top-20 left-20
        w-72 h-72
        bg-orange-500/20 dark:bg-orange-500/20
        rounded-full blur-3xl
      "></div>

      <div className="
        parallax-layer absolute bottom-20 right-20
        w-96 h-96
        bg-orange-400/10 dark:bg-orange-400/10
        rounded-full blur-3xl
      "></div>

      <div className="
        parallax-layer absolute top-1/2 left-1/3
        w-64 h-64
        bg-gray-300/40 dark:bg-white/5
        rounded-full blur-2xl
      "></div>
    </div>

    {/* Content */}
    <div className="relative z-10 text-center max-w-3xl">

      <div className="
        uppercase tracking-widest
        text-orange-500 text-sm
        mb-6 font-semibold
      ">
        Frontend — SPA Mode
      </div>

      <h1 className="
        text-6xl md:text-8xl
        font-bold tracking-tight leading-none
        bg-gradient-to-r
        from-gray-900 to-gray-500
        dark:from-white dark:to-gray-500
        bg-clip-text text-transparent
      ">
        404
      </h1>

      <h2 className="
        text-2xl md:text-3xl font-medium
        text-gray-700 dark:text-gray-300
        mt-4
      ">
        Page Not Found
      </h2>

      <div className="h-1 w-20 bg-orange-500 mx-auto mt-6 mb-6 rounded"></div>

      <p className="
        text-gray-600 dark:text-gray-400
        max-w-xl mx-auto leading-relaxed
      ">
        The route{" "}
        <span className="text-orange-500 font-medium break-all">
          {location.pathname}
        </span>{" "}
        does not exist in this application. The resource may have been removed
        or relocated.
      </p>

      <div className="mt-10">
        <button
          onClick={() => navigate(joinPath(route, "/"))}
          className="
            px-6 py-3 rounded-lg
            border border-orange-500
            text-orange-500
            hover:bg-orange-500
            hover:text-white
            transition duration-300
          "
        >
          Return to Home
        </button>
      </div>

      <div className="
        mt-12 text-xs
        text-gray-500 dark:text-gray-500
      ">
        Static Application — Production Build
      </div>
    </div>
  </div>
);
}
