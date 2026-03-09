import { useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import ImageEditor from "tui-image-editor";
import "tui-image-editor/dist/tui-image-editor.css";
import { useTheme } from "../context/ThemeContext";
import { getApiEndpoint } from "../lib";

const whiteTheme = {
  "common.bi.image": "",
  "common.bisize.width": "0px",
  "common.bisize.height": "0px",
  "common.backgroundColor": "#ffffff",
  "common.border": "1px solid #e5e7eb",

  // header
  "header.backgroundImage": "none",
  "header.backgroundColor": "#ffffff",
  "header.border": "1px solid #e5e7eb",

  // load & download buttons
  "loadButton.backgroundColor": "#f9fafb",
  "loadButton.border": "1px solid #d1d5db",
  "loadButton.color": "#111827",

  "downloadButton.backgroundColor": "#2563eb",
  "downloadButton.border": "none",
  "downloadButton.color": "#ffffff",

  // submenu
  "submenu.backgroundColor": "#ffffff",
  "submenu.partition.color": "#e5e7eb",

  // menu icons
  "menu.normalIcon.color": "#6b7280",
  "menu.activeIcon.color": "#2563eb",
  "menu.disabledIcon.color": "#d1d5db",
  "menu.hoverIcon.color": "#111827",

  "menu.iconSize.width": "24px",
  "menu.iconSize.height": "24px",

  // submenu icons
  "submenu.normalIcon.color": "#6b7280",
  "submenu.activeIcon.color": "#2563eb",

  // labels
  "submenu.normalLabel.color": "#374151",
  "submenu.activeLabel.color": "#2563eb",

  // checkbox
  "checkbox.border": "1px solid #d1d5db",
  "checkbox.backgroundColor": "#ffffff",

  // range slider
  "range.pointer.color": "#2563eb",
  "range.bar.color": "#e5e7eb",
  "range.subbar.color": "#2563eb",

  "range.disabledPointer.color": "#9ca3af",
  "range.disabledBar.color": "#f3f4f6",
  "range.disabledSubbar.color": "#9ca3af",

  // input
  "input.backgroundColor": "#ffffff",
  "input.border": "1px solid #d1d5db",
  "input.color": "#111827",

  // color picker
  "colorpicker.button.border": "1px solid #d1d5db",
  "colorpicker.title.color": "#111827",
};
const blackTheme = {
  "common.bi.image": "",
  "common.bisize.width": "0px",
  "common.bisize.height": "0px",
  "common.backgroundColor": "#0f172a",
  "common.border": "1px solid #1e293b",

  // header
  "header.backgroundImage": "none",
  "header.backgroundColor": "#020617",
  "header.border": "1px solid #1e293b",

  // load & download buttons
  "loadButton.backgroundColor": "#111827",
  "loadButton.border": "1px solid #374151",
  "loadButton.color": "#e5e7eb",

  "downloadButton.backgroundColor": "#2563eb",
  "downloadButton.border": "none",
  "downloadButton.color": "#ffffff",

  // submenu
  "submenu.backgroundColor": "#020617",
  "submenu.partition.color": "#1f2937",

  // menu
  "menu.normalIcon.color": "#94a3b8",
  "menu.activeIcon.color": "#38bdf8",
  "menu.disabledIcon.color": "#475569",
  "menu.hoverIcon.color": "#e2e8f0",

  "menu.iconSize.width": "24px",
  "menu.iconSize.height": "24px",

  // submenu icons
  "submenu.normalIcon.color": "#94a3b8",
  "submenu.activeIcon.color": "#38bdf8",

  // label
  "submenu.normalLabel.color": "#cbd5f5",
  "submenu.activeLabel.color": "#38bdf8",

  // checkbox
  "checkbox.border": "1px solid #475569",
  "checkbox.backgroundColor": "#020617",

  // range slider
  "range.pointer.color": "#38bdf8",
  "range.bar.color": "#1e293b",
  "range.subbar.color": "#38bdf8",

  "range.disabledPointer.color": "#334155",
  "range.disabledBar.color": "#1e293b",
  "range.disabledSubbar.color": "#334155",

  // input box
  "input.backgroundColor": "#020617",
  "input.border": "1px solid #334155",
  "input.color": "#e2e8f0",

  // color picker
  "colorpicker.button.border": "1px solid #475569",
  "colorpicker.title.color": "#e2e8f0",
};

export default function ImageEditorPage() {
  const { theme } = useTheme();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [searchParams] = useSearchParams();
  const imgPath = searchParams.get("path") || "";
  const imgName = searchParams.get("name") || "";

  const editorRef = useRef<ImageEditor | null>(null);

  useEffect(() => {
    if (!containerRef.current) {
      return;
    }
    document.body.style.overflow = "hidden";

    const editor = new ImageEditor(containerRef.current, {
      includeUI: {
        loadImage: {
          // path: "/api/" + imgPath.replace("/api/", "").replace("/api", ""),
          path: getApiEndpoint("", imgPath.replace(/^(\/api\/)/, "").replace(/^(\/api)/, "")),
          name: imgName,
        },
        theme: theme === "light" ? whiteTheme : blackTheme,
        menu: [
          "crop",
          "flip",
          "rotate",
          "draw",
          "shape",
          "icon",
          "text",
          "mask",
          "filter",
        ],
        initMenu: "filter",
        uiSize: {
          width: "100%",
          height: "100%",
        },
        menuBarPosition: "bottom",
      },
      cssMaxWidth: 1000,
      cssMaxHeight: 700,
      usageStatistics: false,
      selectionStyle: {
        cornerSize: 20,
        rotatingPointOffset: 70,
      },
    });

    editorRef.current = editor;
    return () => {
      editor.destroy();
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <>
      <div
        ref={containerRef}
        style={{
          width: "100%",
          height: "100%",
        }}
      />
    </>
  );
}
