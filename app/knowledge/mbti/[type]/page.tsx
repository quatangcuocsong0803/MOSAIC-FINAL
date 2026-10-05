import { notFound } from 'next/navigation';
import { mbtiData } from '@/lib/data/mbtiData';
import KnowledgeArticle from '@/src/components/knowledge/KnowledgeArticle';

export default async function MBTIDetailPage({ params }: { params: Promise<{ type: string }> }) {
  const resolvedParams = await params;
  const typeKey = resolvedParams.type.toUpperCase();
  const data = mbtiData[typeKey];

  if (!data) return notFound();

  return <KnowledgeArticle title={data.title} category="MBTI" sections={data.sections} />;
}
