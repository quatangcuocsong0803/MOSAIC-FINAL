import Link from 'next/link';
import { BookOpen } from "@/src/components/ui/Icons";

export default function KnowledgePage() {
  return (
    <main className="min-h-screen pt-32 pb-20 px-4 md:px-8 relative z-10 flex justify-center">
      <div className="max-w-5xl w-full">
        <h1 className="text-4xl md:text-5xl font-serif text-[#4A3F35] mb-16 text-center border-b border-[#8B7355]/20 pb-6">Knowledge Hub</h1>
        
        {/* Sơ đồ cây (Tree Diagram) */}
        <div className="font-serif text-[#4A3F35] max-w-4xl mx-auto">
          {/* Nút gốc */}
          <div className="mb-3">
            <div className="text-2xl font-bold mb-3 flex items-center gap-4">
              <div className="w-5 h-5 rounded-full border border-[#8B7355] flex items-center justify-center bg-[#FAF8F5] text-[#8B7355] shadow-xs">
                <span className="w-2 h-2 rounded-full bg-[#8B7355]" />
              </div>
              <span>Hệ thống lý thuyết</span>
            </div>
            <div className="ml-9">
              <Link 
                href="/knowledge/theory"
                className="inline-flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-full border border-[#8B7355]/40 bg-white/70 text-[#8B7355] hover:bg-[#8B7355] hover:text-white transition-all duration-300 shadow-xs group"
              >
                <BookOpen className="w-3.5 h-3.5 text-current" strokeWidth={1.5} />
                <span>Lý thuyết tổng quan</span>
                <span className="text-xs transition-transform duration-300 group-hover:translate-x-1">→</span>
              </Link>
            </div>
          </div>
          
          {/* Trục chính */}
          <div className="ml-2.5 border-l-[2px] border-[#8B7355]/40 pl-8 md:pl-12 space-y-16 py-8">
            
            {/* Nhánh 1: Cognitive Function */}
            <div className="relative">
              <div className="absolute -left-8 md:-left-12 top-4 w-8 md:w-12 border-t-[2px] border-[#8B7355]/40"></div>
              <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <h2 className="text-xl md:text-2xl font-bold text-[#8B7355]">Cognitive Functions</h2>
                <Link 
                  href="/knowledge/cognitive/overview" 
                  className="inline-flex items-center gap-1.5 text-xs md:text-sm font-semibold px-3 py-1.5 rounded-full border border-[#8B7355]/40 bg-white/70 text-[#8B7355] hover:bg-[#8B7355] hover:text-white transition-all duration-300 shadow-xs"
                >
                  <BookOpen className="w-3.5 h-3.5 text-current" strokeWidth={1.5} />
                  <span>Đọc Tổng quan Cognitive Functions</span>
                </Link>
              </div>
              <div className="ml-4 border-l border-[#8B7355]/20 pl-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                {['Ni', 'Ne', 'Si', 'Se', 'Ti', 'Te', 'Fi', 'Fe'].map(func => (
                  <div key={func} className="relative">
                    <div className="absolute -left-6 top-1/2 w-6 border-t border-[#8B7355]/20"></div>
                    <Link className="block p-3 text-center border border-[#8B7355]/20 rounded-lg bg-white/50 backdrop-blur-sm hover:bg-[#8B7355]/10 hover:border-[#8B7355]/50 transition-all duration-300 shadow-sm" href={`/knowledge/cognitive/${func.toLowerCase()}`}>
                      {func}
                    </Link>
                  </div>
                ))}
              </div>
            </div>

            {/* Nhánh 2: Enneagram */}
            <div className="relative">
              <div className="absolute -left-8 md:-left-12 top-4 w-8 md:w-12 border-t-[2px] border-[#8B7355]/40"></div>
              <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <h2 className="text-xl md:text-2xl font-bold text-[#8B7355]">Enneagram</h2>
                <Link 
                  href="/knowledge/enneagram/overview" 
                  className="inline-flex items-center gap-1.5 text-xs md:text-sm font-semibold px-3 py-1.5 rounded-full border border-[#8B7355]/40 bg-white/70 text-[#8B7355] hover:bg-[#8B7355] hover:text-white transition-all duration-300 shadow-xs"
                >
                  <BookOpen className="w-3.5 h-3.5 text-current" strokeWidth={1.5} />
                  <span>Đọc Tổng quan Enneagram</span>
                </Link>
              </div>
              <div className="ml-4 border-l border-[#8B7355]/20 pl-6 grid grid-cols-2 md:grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(type => (
                  <div key={type} className="relative">
                    <div className="absolute -left-6 top-1/2 w-6 border-t border-[#8B7355]/20"></div>
                    <Link className="block p-3 font-semibold text-center border border-[#8B7355]/30 rounded-lg bg-white/60 backdrop-blur-sm hover:bg-[#8B7355]/15 hover:border-[#8B7355]/60 hover:-translate-y-0.5 transition-all duration-300 shadow-sm text-[#4A3F35]" href={`/knowledge/enneagram/type-${type}`}>
                      Type {type}
                    </Link>
                  </div>
                ))}
              </div>
            </div>

            {/* Nhánh 3: MBTI */}
            <div className="relative">
              <div className="absolute -left-8 md:-left-12 top-4 w-8 md:w-12 border-t-[2px] border-[#8B7355]/40"></div>
              <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <h2 className="text-xl md:text-2xl font-bold text-[#8B7355]">MBTI (16 Types)</h2>
                <Link 
                  href="/knowledge/mbti/overview" 
                  className="inline-flex items-center gap-1.5 text-xs md:text-sm font-semibold px-3 py-1.5 rounded-full border border-[#8B7355]/40 bg-white/70 text-[#8B7355] hover:bg-[#8B7355] hover:text-white transition-all duration-300 shadow-xs"
                >
                  <BookOpen className="w-3.5 h-3.5 text-current" strokeWidth={1.5} />
                  <span>Đọc Tổng quan & Lý thuyết MBTI</span>
                </Link>
              </div>
              <div className="ml-4 border-l border-[#8B7355]/20 pl-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                {['INTJ', 'INTP', 'ENTJ', 'ENTP', 'INFJ', 'INFP', 'ENFJ', 'ENFP', 'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ', 'ISTP', 'ISFP', 'ESTP', 'ESFP'].map(type => (
                  <div key={type} className="relative">
                    <div className="absolute -left-6 top-1/2 w-6 border-t border-[#8B7355]/20"></div>
                    <Link className="block p-3 font-semibold text-center border border-[#8B7355]/30 rounded-lg bg-white/60 backdrop-blur-sm hover:bg-[#8B7355]/15 hover:border-[#8B7355]/60 hover:-translate-y-0.5 transition-all duration-300 shadow-sm text-[#4A3F35]" href={`/knowledge/mbti/${type.toLowerCase()}`}>
                      {type}
                    </Link>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}
