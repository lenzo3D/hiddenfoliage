// Prefix for public/ assets referenced outside the optimizer (raw <video>,
// posters, unoptimized <Image>). In the browser the base path is read off the
// page's own URL — immune to build-time env inlining and to the Windows shell
// rewriting "/hiddenfoliage" into a filesystem path. On the server (and in
// every non-Pages build) it falls back to the env value, which is empty.
export const asset = (p: string) => {
  if (typeof window !== "undefined") {
    return (window.location.pathname.startsWith("/hiddenfoliage") ? "/hiddenfoliage" : "") + p;
  }
  return (process.env.NEXT_PUBLIC_BASE_PATH ?? "") + p;
};
