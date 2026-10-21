"use client";
import { usePathname } from "next/navigation";
export default function FeatureCanvas({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const within = (prefix: string) => path === prefix || path.startsWith(prefix + "/");
  const editorial = within("/about") || path === "/knowledge/theory";
  const feature = [
    "/test", "/result", "/discover", "/discussion", "/knowledge",
    "/statistics", "/profile", "/search", "/settings", "/messages",
  ].some(within);
  if (path === "/about" || (!feature && !editorial)) return <>{children}</>;

  // A single page-sized paper contains headings as well as cards. Only pages
  // with an existing complete page frame keep that frame instead.
  const framed = !["/discussion", "/profile", "/settings", "/messages"].some(within)
    && path !== "/knowledge/theory" && path !== "/about/news" && path !== "/about/developer";
  const knowledge = within("/knowledge") && path !== "/knowledge/theory";
  const width = within("/test") || within("/result") ? "test" : path === "/about/exhibition" ? "exhibition" : "standard";
  return (
    <div className={`mosaic-feature-canvas ${editorial ? "mosaic-editorial-canvas" : ""} ${knowledge ? "mosaic-knowledge-canvas" : ""}`} data-paper-width={width}>
      <div className={framed ? "mosaic-feature-paper" : "mosaic-feature-content"}>
        {children}
      </div>
    </div>
  );
}
