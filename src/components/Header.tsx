import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useGoogleAuth } from '@/providers/GoogleAuthProvider';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useCalendarSync } from '@/hooks/useCalendarSync';
import { useSharedState } from '@/hooks/useSharedState';
import { useToast } from '@/components/ui/use-toast';
import { RefreshCw } from 'lucide-react';

export default function Header() {
  const { authState } = useGoogleAuth();
  const { syncCalendar, lastSynced } = useCalendarSync();
  const { isLoading } = useSharedState();
  const { toast } = useToast();
  const [timeAgo, setTimeAgo] = React.useState<string>('');

  const handleSync = async () => {
    await syncCalendar();
    toast({
      title: "Calendar Synced",
      description: "Your calendar events have been updated.",
    });
  };

  // Update the time ago text every minute
  React.useEffect(() => {
    const updateTimeAgo = () => {
      if (lastSynced) {
        const now = new Date();
        const syncDate = new Date(lastSynced);
        const diffMinutes = Math.floor((now.getTime() - syncDate.getTime()) / (1000 * 60));
        
        if (diffMinutes < 1) {
          setTimeAgo('<1min');
        } else if (diffMinutes < 60) {
          setTimeAgo(`${diffMinutes}min`);
        } else if (diffMinutes < 1440) { // less than 24 hours
          setTimeAgo(`${Math.floor(diffMinutes / 60)}h`);
        } else {
          setTimeAgo(`${Math.floor(diffMinutes / 1440)}d`);
        }
      }
    };

    updateTimeAgo();
    const interval = setInterval(updateTimeAgo, 60000);
    return () => clearInterval(interval);
  }, [lastSynced]);

  return (
    <header className="border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          <div className="flex items-center space-x-8">
            <Link to="/" className="font-medium">
              timetracker2400
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {authState.isAuthenticated && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSync}
                disabled={isLoading}
                className="flex items-center space-x-2 text-sm text-zinc-600 hover:bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-1.5"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className={cn("w-4 h-4 animate-spin")} />
                    <span>Syncing...</span>
                  </>
                ) : (
                  <>
                    <div className="flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      <span>Hours synced just now</span>
                    </div>
                  </>
                )}
              </Button>
            )}

            {authState.isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={authState.user?.imageUrl} />
                  <AvatarFallback>{authState.user?.name?.charAt(0)}</AvatarFallback>
                </Avatar>
              </div>
            ) : (
              <Link
                to="/login"
                className="text-sm font-medium text-gray-900 hover:text-gray-700"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
