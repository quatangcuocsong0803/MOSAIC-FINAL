import Link from "next/link";

export default function DeveloperPage() {
  return (
    <main className="w-full max-w-4xl mx-auto px-5 py-14 md:py-20">
      <div className="rounded-[28px] border border-[#B39A65]/35 bg-[#FDFCF9]/90 p-8 md:p-12 shadow-sm">
        <p className="text-xs tracking-[0.2em] text-[#8B6B4A] font-semibold mb-3">MOSAIC</p>
        <h1 className="font-serif text-4xl md:text-5xl text-[#3C3027] mb-6">Về nhà phát triển</h1>
        <p className="text-[#65584D] leading-8 mb-8">
          Không gian này dành cho câu chuyện phát triển MOSAIC: từ ý tưởng ban đầu, quá trình xây dựng sản phẩm,
          những lựa chọn thiết kế cho tới các định hướng nghiên cứu và tính năng tiếp theo.
        </p>
        <Link href="/" className="text-sm font-semibold text-[#6D543C] hover:underline">← Trở về trang chủ</Link>
      </div>
    </main>
  );
}
