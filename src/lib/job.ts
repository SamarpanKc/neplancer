import { supabase } from '@/lib/supabase';

export async function getAllOpenJobs() {
  const { data, error } = await supabase
    .from('jobs')
    .select(`
      id,
      title,
      description,
      category,
      budget,
      skills,
      status,
      created_at,
      deadline,
      client_id
    `)
    .eq('status', 'open')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}
export async function getAllOpenJobsWithStats() {
  const { data, error } = await supabase
    .from('jobs')
    .select(`
      id,
      title,
      description,
      category,
      budget,
      skills,
      status,
      created_at,
      deadline,
      client_id,
      proposals:proposals(count)
    `)
    .eq('status', 'open')
    .order('created_at', { ascending: false });

  if (error) throw error;
  
  // Transform the data to include proposal count
  return data.map(job => ({
    ...job,
    proposalsCount: job.proposals?.[0]?.count || 0
  }));
}