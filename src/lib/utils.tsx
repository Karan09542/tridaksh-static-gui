export const makeEndPoint = (basename: string, path: string) => {
  let pathname = basename;
  if (pathname.endsWith("/")) {
    pathname = pathname.slice(0, -1);
  }

  if (pathname.startsWith("/")) {
    pathname = pathname.slice(1);
  }
  if (path.startsWith("/")) path = path.slice(1);

  return `/api/${pathname}/${path}`.replace(/\/+/g, "/");
};

export const createEditorUrl = (type: "image" | "text", path: string, name: string) => {
  let pageRef = type === "image" ? "image-editor" : "text-editor";
  return `${route}/${pageRef}?path=${encodeURIComponent(path.replace("/api/", ""))}&name=${encodeURIComponent(name.split("/").pop() || (type === "image" ? "image.png" : "text.txt"))}`;
};

export const getOriginalUrl = (basename: string, fileName: string) => {
  let pathName = decodeURI(basename);
  if (pathName.endsWith("/")) pathName = pathName.slice(0, -1);
  if (pathName.startsWith("/folders/")) {
    return pathName.replace("/folders/", "/api") + "/" + fileName;
  } else if (pathName.startsWith("/folders")) {
    return pathName.replace("/folders", "/api") + "/" + fileName;
  } else {
    return "/api/" + fileName;
  }
};

export const joinPath = (...paths: string[]) => {
  return paths.reduce((path, segment) => {
    if (path.endsWith("/")) path = path.slice(0, -1);
    if (!path.startsWith("/")) path = path = "/" + path;
    if (segment.startsWith("/")) segment = segment.slice(1);
    if (segment.endsWith("/")) segment = segment.slice(0, -1);
    return `${path}/${segment}`.replace(/\/+/g, "/");
  }, "")
};

export const getApiEndpoint = (basename: string, path: string): string => {
  const route = import.meta.env.DEV ? "/api" : "";
  basename = basename.replace(/^(\/__dashboard|\/__dashboard\/)/, "");
  basename = basename.replace(/^(\/api|\/api\/)/, "");
  basename = basename.replace(/^(\/folders\/|\/folders|\/search\/|\/search)/, "")
  return `${route}/${joinPath(basename, path).slice(1)}`.replace(/\/+/g, "/");
};

export const route = import.meta.env.DEV ? "" : "/__dashboard";