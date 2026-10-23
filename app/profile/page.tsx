import { getOwnerProfileSummary } from '@/app/actions/profile';
import ProfileOwnerClient from '@/src/components/ProfileOwnerClient';
export default async function ProfilePage() {
  const result = await getOwnerProfileSummary();
  return <ProfileOwnerClient initialProfile={result.success ? result.profile : undefined} />;
}
