import { create } from 'zustand';
import { GoogleCalendarEvent, Project } from '@/lib/types';
import { getProjects, upsertProject } from '@/lib/supabase';
import { useGoogleAuth } from '@/providers/GoogleAuthProvider';

interface FilterOptions {
  searchTerm: string;
  project: string;
  dateRange: 'day' | 'week' | 'month' | 'year' | 'all';
  activity: string;
  selectedProjects: string[];
  selectedActivities: string[];
  startDate?: Date;
  endDate?: Date;
}

interface ActivityColor {
  type: string;
  color: string;
}

interface SharedState {
  events: GoogleCalendarEvent[];
  filteredEvents: GoogleCalendarEvent[];
  customProjects: Project[];
  projectFilters: Record<string, string>;
  filters: FilterOptions;
  lastSynced: Date | null;
  isLoading: boolean;
  activityColors: ActivityColor[];
  setEvents: (events: GoogleCalendarEvent[]) => void;
  setFilteredEvents: (events: GoogleCalendarEvent[]) => void;
  setCustomProjects: (projects: Project[], userId?: string) => Promise<void>;
  setProjectFilters: (filters: Record<string, string>) => void;
  updateFilters: (filters: Partial<FilterOptions>) => void;
  setLastSynced: (date: Date | null) => void;
  setIsLoading: (loading: boolean) => void;
  updateActivityColor: (type: string, color: string) => void;
  loadProjects: () => Promise<void>;
}

export const useSharedState = create<SharedState>((set, get) => ({
  events: [],
  filteredEvents: [],
  customProjects: [],
  projectFilters: {},
  filters: {
    searchTerm: '',
    project: 'All',
    dateRange: 'month',
    activity: 'All',
    selectedProjects: [],
    selectedActivities: [],
    startDate: new Date(),
    endDate: new Date()
  },
  lastSynced: null,
  isLoading: false,
  activityColors: [
    { type: 'design', color: '#22C55F' },  // Green
    { type: 'dev', color: '#6EE7B7' },     // Light green
    { type: 'meeting', color: '#D1FAE5' }, // Mint
    { type: 'marketing', color: '#FEF18B' }, // Yellow
    { type: 'other', color: '#FED8AA' },    // Orange
    { type: 'admin', color: '#7ED3FC' }, // Blue
  ],
  setEvents: (events) => set({ events }),
  setFilteredEvents: (filteredEvents) => set({ filteredEvents }),
  setCustomProjects: async (projects, userId?: string) => {
    set({ customProjects: projects });
    
    // Only save to Supabase if userId is provided
    if (userId) {
      try {
        // Save each project to Supabase
        await Promise.all(
          projects.map(project => upsertProject(project, userId))
        );
      } catch (error) {
        console.error('Error saving projects to Supabase:', error);
        throw error;
      }
    }
  },
  setProjectFilters: (projectFilters) => set({ projectFilters }),
  updateFilters: (newFilters) => set((state) => ({
    filters: { ...state.filters, ...newFilters }
  })),
  setLastSynced: (lastSynced) => set({ lastSynced }),
  setIsLoading: (isLoading) => set({ isLoading }),
  updateActivityColor: (type, color) => set((state) => ({
    activityColors: state.activityColors.map(ac => 
      ac.type === type ? { ...ac, color } : ac
    )
  })),
  loadProjects: async () => {
    const auth = useGoogleAuth();
    if (!auth.authState.isAuthenticated || !auth.authState.user) {
      console.log('User not authenticated, skipping project load');
      return;
    }
    
    set({ isLoading: true });
    try {
      console.log('Loading projects for user:', auth.authState.user.id);
      const projects = await getProjects(auth.authState.user.id);
      console.log('Loaded projects from Supabase:', projects);
      set({ customProjects: projects });
    } catch (error) {
      console.error('Error loading projects:', error);
    } finally {
      set({ isLoading: false });
    }
  }
})); 