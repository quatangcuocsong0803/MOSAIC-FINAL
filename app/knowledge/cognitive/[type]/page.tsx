import { notFound } from 'next/navigation';
import { cognitiveData } from '@/lib/data/cognitiveData';
import KnowledgeArticle from '@/src/components/knowledge/KnowledgeArticle';

export default async function CognitiveDetailPage({ params }: { params: Promise<{ type: string }> }) {
  const resolvedParams = await params;
  const typeKey = resolvedParams.type.charAt(0).toUpperCase() + resolvedParams.type.slice(1).toLowerCase(); // Chuẩn hóa Ni, Ne, Ti, Te...
  const data = cognitiveData[typeKey] || cognitiveData[resolvedParams.type.toUpperCase()];

  if (!data) return notFound();

  return <KnowledgeArticle title={data.title || typeKey} category="Cognitive Functions" sections={data.sections} />;
}
