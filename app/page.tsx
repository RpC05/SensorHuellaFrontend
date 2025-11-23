'use client';

import { useState } from 'react';
import { Toaster } from 'sonner';
import { Sidebar } from '@/components/sidebar';
import { Header } from '@/components/header';
import { Dashboard } from '@/components/dashboard';
import { UsersManagement } from '@/components/users-management';
import { FingerprintsManagement } from '@/components/fingerprints-management';
import { RfidCardsManagement } from '@/components/rfid-cards-management';
import { AccessLogsViewer } from '@/components/access-logs-viewer';
import { LiveVerification } from '@/components/live-verification';
import type { PageType } from '@/lib/types';

export default function Home() {
  const [currentPage, setCurrentPage] = useState<PageType>('dashboard');
  const [userCount, setUserCount] = useState(0);

  return (
    <>
      <Toaster position="top-right" richColors />
      <div className="flex h-screen bg-background text-foreground">
        <Sidebar currentPage={currentPage} onNavigate={setCurrentPage} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header currentPage={currentPage} userCount={userCount} />
          <main className="flex-1 overflow-auto p-6">
            {currentPage === 'dashboard' && <Dashboard onCountChange={setUserCount} />}
            {currentPage === 'users' && <UsersManagement onUserCountChange={setUserCount} />}
            {currentPage === 'fingerprints' && <FingerprintsManagement />}
            {currentPage === 'rfid-cards' && <RfidCardsManagement />}
            {currentPage === 'access-logs' && <AccessLogsViewer />}
            {currentPage === 'verification' && <LiveVerification />}
          </main>
        </div>
      </div>
    </>
  );
}
