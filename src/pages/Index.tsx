import React from 'react';
import { useGoogleAuth } from '@/providers/GoogleAuthProvider';
import { useSharedState } from '@/hooks/useSharedState';
import { useCalendarSync } from '@/hooks/useCalendarSync';
import TotalHoursView from '@/components/TotalHoursView';
import ProjectsOverview from '@/components/ProjectsOverview';
import Header from '@/components/Header';

export default function Index() {
  const { authState } = useGoogleAuth();
  const { syncCalendar } = useCalendarSync();
  const { lastSynced, loadProjects } = useSharedState();

  // Initial sync and load projects
  React.useEffect(() => {
    if (authState.isAuthenticated) {
      if (!lastSynced) {
        syncCalendar();
      }
      loadProjects();
    }
  }, [authState.isAuthenticated, lastSynced, syncCalendar, loadProjects]);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="container mx-auto px-4 py-8 space-y-8">
        <TotalHoursView />
        <ProjectsOverview />
      </main>
    </div>
  );
}
