import Link from "next/link";

const pieces = ["/flower-left.jpg", "/bird-1.jpg", "/moon.jpg", "/flower-right.jpg"];

export default function ExhibitionPage() {
  return (
    <main className="w-full max-w-5xl mx-auto px-5 py-14 md:py-20">
      <header className="mb-10 text-center">
        <p className="text-xs tracking-[0.2em] text-[#8B6B4A] font-semibold mb-3">MOSAIC EXHIBITION</p>
        <h1 className="font-serif text-4xl md:text-5xl text-[#3C3027]">Triển lãm typology</h1>
        <p className="mt-4 text-[#706357]">Một không gian thị giác dành cho những hình ảnh, biểu tượng và cách diễn giải lấy cảm hứng từ tính cách.</p>
      </header>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {pieces.map((src) => (
          <div key={src} className="h-72 overflow-hidden rounded-2xl border border-[#B39A65]/30 bg-[#F8F5EE]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt="Artwork typology" className="w-full h-full object-cover sepia-[.12]" />
          </div>
        ))}
      </div>
      <Link href="/" className="inline-block mt-10 text-sm font-semibold text-[#6D543C] hover:underline">← Trở về trang chủ</Link>
    </main>
  );
}
