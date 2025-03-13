import { createClient } from '@supabase/supabase-js';
import { Project } from './types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function getProjects(userId: string): Promise<Project[]> {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('user_id', userId);

  if (error) {
    console.error('Error fetching projects:', error);
    return [];
  }

  return data || [];
}

export async function upsertProject(project: Project, userId: string): Promise<void> {
  try {
    console.log('Attempting to save project:', { project, userId });

    // Ensure userId is in the correct format
    const userIdUUID = userId.includes('-') 
      ? userId 
      : `${userId.slice(0, 8)}-${userId.slice(8, 12)}-${userId.slice(12, 16)}-${userId.slice(16, 20)}-${userId.slice(20)}`;
    
    console.log('Using userId:', userIdUUID);

    const projectData = {
      id: project.id,
      user_id: userIdUUID,
      name: project.name,
      filter_term: project.filterTerm,
      total_hours: project.totalHours,
      hourly_rate: project.hourlyRate || null,
      budget_hours: project.budgetHours || null,
      team_members: project.teamMembers || [],
      activities: project.activities || [],
      updated_at: new Date().toISOString()
    };
    
    console.log('Sending data to Supabase:', JSON.stringify(projectData, null, 2));

    const { data, error } = await supabase
      .from('projects')
      .upsert(projectData)
      .select();

    if (error) {
      console.error('Supabase error details:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
        error: JSON.stringify(error, null, 2)
      });
      throw error;
    }

    console.log('Successfully saved project:', data);
  } catch (error) {
    console.error('Error in upsertProject:', {
      error: JSON.stringify(error, null, 2),
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
    throw error;
  }
} 