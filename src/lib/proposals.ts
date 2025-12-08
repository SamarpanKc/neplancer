// lib/proposals.ts
import { supabase } from "./supabase";

// Get proposals count by job ID
export async function getProposalsCountByJobId(jobId: string): Promise<number> {
  const { count, error } = await supabase
    .from("proposals")
    .select("*", { count: 'exact', head: true })
    .eq("job_id", jobId);

  if (error) {
    console.error("Error fetching proposals count:", error);
    return 0;
  }

  return count || 0;
}

// Get proposals counts for multiple jobs
export async function getProposalsCountsByJobIds(jobIds: string[]): Promise<Record<string, number>> {
  if (jobIds.length === 0) return {};

  const { data, error } = await supabase
    .from("proposals")
    .select("job_id")
    .in("job_id", jobIds);

  if (error || !data) {
    console.error("Error fetching proposals counts:", error);
    return {};
  }

  // Count proposals per job
  const counts: Record<string, number> = {};
  data.forEach((proposal) => {
    counts[proposal.job_id] = (counts[proposal.job_id] || 0) + 1;
  });

  return counts;
}

export const proposalsApi = {
  getProposalsCountByJobId,
  getProposalsCountsByJobIds
}