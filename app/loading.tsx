import LoadingIndicator from "@/src/components/navigation/LoadingIndicator";
export default function Loading() {
  return <div className="mosaic-route-loading" role="status" aria-live="polite" aria-busy="true">
    <LoadingIndicator />
    <span className="sr-only">Đang tải trang, vui lòng chờ.</span>
    <div className="mosaic-skeleton-title" /><div className="mosaic-skeleton-description" />
    <div className="mosaic-skeleton-grid">{[1,2,3].map(i => <div className="mosaic-skeleton-card" key={i}><div /><div /><div /></div>)}</div>
  </div>;
}
