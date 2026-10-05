import { notFound } from 'next/navigation';
import { enneagramData } from '@/lib/data/enneagramData';
import KnowledgeArticle from '@/src/components/knowledge/KnowledgeArticle';

export default async function EnneagramDetailPage({ params }: { params: Promise<{ type: string }> }) {
  const resolvedParams = await params;
  // Hỗ trợ cả định dạng "type-1", "1", hay "overview"
  const rawParam = resolvedParams.type.toUpperCase();
  const typeNumber = resolvedParams.type.includes('-') 
    ? resolvedParams.type.split('-')[1] 
    : resolvedParams.type;
  const typeKey = `TYPE ${typeNumber}`;
  const data = enneagramData[typeKey] || enneagramData[rawParam];

  if (!data) return notFound();

  return <KnowledgeArticle title={data.title} subtitle={data.subtitle} category="Enneagram" sections={data.sections} />;
}
