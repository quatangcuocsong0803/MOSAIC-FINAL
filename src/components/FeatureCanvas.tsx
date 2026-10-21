"use client";
import { usePathname } from "next/navigation";
export default function FeatureCanvas({
  children,
}: {
  children: React.ReactNode;
}) {
  const path = usePathname();
  const editorial = path.startsWith("/about/") || path === "/knowledge/theory";
  const feature = [
    "/test",
    "/result",
    "/discover",
    "/discussion",
    "/knowledge",
    "/statistics",
    "/profile",
    "/search",
    "/settings",
    "/messages",
  ].some((prefix) => path === prefix || path.startsWith(prefix + "/"));
  if (!feature && !editorial) return <>{children}</>;
  return (
    <div
      className={`mosaic-feature-canvas ${editorial ? "mosaic-editorial-canvas" : ""}`}
    >
      <div className="mosaic-feature-paper">{children}</div>
    </div>
  );
}
