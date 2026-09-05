import { UserProfileView } from '@/components/UserProfileView';

export default async function UserProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const resolvedParams = await params;
  return <UserProfileView username={resolvedParams.username} />;
}
