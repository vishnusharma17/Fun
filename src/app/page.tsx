'use client';

import { AuthProvider } from '@/context/AuthContext';
import { ArenaHomeView } from '@/components/ArenaHomeView';

export default function Home() {
  return (
    <AuthProvider>
      <ArenaHomeView />
    </AuthProvider>
  );
}
