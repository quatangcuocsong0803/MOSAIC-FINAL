import { notFound } from 'next/navigation';
import { cognitiveData } from '@/lib/data/cognitiveData';
import Link from 'next/link';

export default async function CognitiveDetailPage({ params }: { params: Promise<{ type: string }> }) {
  const resolvedParams = await params;
  const typeKey = resolvedParams.type.charAt(0).toUpperCase() + resolvedParams.type.slice(1).toLowerCase(); // Chuẩn hóa Ni, Ne, Ti, Te...
  const data = cognitiveData[typeKey] || cognitiveData[resolvedParams.type.toUpperCase()];

  if (!data) return notFound();

  return (
    <main className="min-h-screen pt-32 pb-20 px-4 md:px-8 relative z-10 flex justify-center">
      <article className="max-w-4xl w-full font-serif text-[#4A3F35] bg-white/70 backdrop-blur-md p-8 md:p-14 rounded-2xl border border-[#8B7355]/20 shadow-lg">
        <Link className="inline-flex items-center text-[#8B7355] hover:text-[#4A3F35] mb-8 font-semibold transition-colors duration-300" href="/knowledge">
          <span>← Quay lại Sơ đồ Kiến thức</span>
        </Link>
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-12 tracking-wide border-b border-[#8B7355]/20 pb-6">{data.title || typeKey}</h1>
        <div className="space-y-10 text-lg leading-relaxed">
          {data.sections.map((sec: any, index: number) => (
            <section key={index}>
              <h2 className="text-2xl font-bold text-[#8B7355] mb-4">{sec.heading}</h2>
              <div className="space-y-4 whitespace-pre-wrap">{sec.content}</div>
            </section>
          ))}
        </div>
      </article>
    </main>
  );
}
