import Link from 'next/link';
export const metadata={title:'Triển lãm typology | MOSAIC'};
export default function ExhibitionPage() {
  return <main className="w-full max-w-5xl mx-auto px-5 py-20 md:py-28 text-center min-h-[65vh]">
    <p className="text-xs tracking-[0.2em] text-[#8B6B4A] font-semibold mb-4">MOSAIC EXHIBITION</p>
    <h1 className="font-serif text-4xl md:text-5xl text-[#3C3027]">Triển lãm typology</h1>
    <p className="font-serif text-3xl md:text-4xl text-[#6D543C] mt-10">Coming soon…</p>
    <Link href="/" className="inline-block mt-10 text-sm font-semibold text-[#6D543C] hover:underline">← Trở về trang chủ</Link>
  </main>;
}
