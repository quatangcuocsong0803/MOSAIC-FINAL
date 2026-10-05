import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <h1 className="font-serif text-5xl font-bold text-[#5C4326] mb-4">404</h1>
      <p className="text-gray-600 mb-6 font-sans">
        Trang bạn tìm kiếm không tồn tại hoặc đã bị di chuyển.
      </p>
      <Link
        href="/"
        className="px-6 py-2.5 bg-[#8B6B4A] hover:bg-[#5C4326] text-white rounded-xl font-medium transition-colors"
      >
        Trở về trang chủ
      </Link>
    </div>
  );
}
