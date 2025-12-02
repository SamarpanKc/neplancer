// lib/jobs.ts
import { supabase } from "./supabase";
import { mapJob } from "./mappers";
import type { Database } from "@/types/database";

export type Job = ReturnType<typeof mapJob>;

type JobWithClient = Database["public"]["Tables"]["jobs"]["Row"] & {
  clients: Database["public"]["Tables"]["clients"]["Row"] & {
    profiles: Database["public"]["Tables"]["profiles"]["Row"];
  };
};

// Get single job by ID
export async function getJobById(id: string): Promise<Job | null> {
  const { data, error } = await supabase
    .from("jobs")
    .select(`
      *,
      clients!inner (
        *,
        profiles!inner (*)
      )
    `)
    .eq("id", id)
    .single();

  if (error || !data) {
    console.error("Error fetching job:", error);
    return null;
  }

  const typedData = data as unknown as JobWithClient;
  return mapJob(typedData, typedData.clients);
}

// Get all jobs
export async function getAllJobs(): Promise<Job[]> {
  const { data, error } = await supabase
    .from("jobs")
    .select(`
      *,
      clients!inner (
        *,
        profiles!inner (*)
      )
    `)
    .order("created_at", { ascending: false });

  if (error || !data) {
    console.error("Error fetching jobs:", error);
    return [];
  }

  const typedData = data as unknown as JobWithClient[];
  return typedData.map((row) => mapJob(row, row.clients));
}

// Get jobs by client ID
export async function getJobsByClientId(clientId: string): Promise<Job[]> {
  const { data, error } = await supabase
    .from("jobs")
    .select(`
      *,
      clients!inner (
        *,
        profiles!inner (*)
      )
    `)
    .eq("client_id", clientId)
    .order("created_at", { ascending: false });

  if (error || !data) {
    console.error("Error fetching jobs by client:", error);
    return [];
  }

  const typedData = data as unknown as JobWithClient[];
  return typedData.map((row) => mapJob(row, row.clients));
}

// Get jobs by status
export async function getJobsByStatus(
  status: "open" | "in_progress" | "completed" | "cancelled"
): Promise<Job[]> {
  const { data, error } = await supabase
    .from("jobs")
    .select(`
      *,
      clients!inner (
        *,
        profiles!inner (*)
      )
    `)
    .eq("status", status)
    .order("created_at", { ascending: false });

  if (error || !data) {
    console.error("Error fetching jobs by status:", error);
    return [];
  }

  const typedData = data as unknown as JobWithClient[];
  return typedData.map((row) => mapJob(row, row.clients));
}

// Get jobs by client ID and status
export async function getJobsByClientAndStatus(
  clientId: string,
  status: "open" | "in_progress" | "completed" | "cancelled"
): Promise<Job[]> {
  const { data, error } = await supabase
    .from("jobs")
    .select(`
      *,
      clients!inner (
        *,
        profiles!inner (*)
      )
    `)
    .eq("client_id", clientId)
    .eq("status", status)
    .order("created_at", { ascending: false });

  if (error || !data) {
    console.error("Error fetching jobs by client and status:", error);
    return [];
  }

  const typedData = data as unknown as JobWithClient[];
  return typedData.map((row) => mapJob(row, row.clients));
}

// Create a new job
export async function createJob(payload: {
  clientId: string;
  title: string;
  description: string;
  budget: number;
  category: string;
  skills: string[];
  deadline?: string | null;
}): Promise<Job | null> {
  // Insert the job
  const { data, error } = await supabase
    .from("jobs")
    .insert({
      client_id: payload.clientId,
      title: payload.title,
      description: payload.description,
      budget: payload.budget,
      category: payload.category,
      skills: payload.skills,
      deadline: payload.deadline || null,
      status: "open",
    })
    .select(`
      *,
      clients!inner (
        *,
        profiles!inner (*)
      )
    `)
    .single();

  if (error || !data) {
    console.error("Error creating job:", error);
    return null;
  }

  // Increment client's jobs_posted count
  await incrementClientJobsPosted(payload.clientId);

  const typedData = data as unknown as JobWithClient;
  return mapJob(typedData, typedData.clients);
}

// Update a job
export async function updateJob(
  id: string,
  payload: {
    title?: string;
    description?: string;
    budget?: number;
    category?: string;
    skills?: string[];
    deadline?: string | null;
    status?: "open" | "in_progress" | "completed" | "cancelled";
  }
): Promise<Job | null> {
  const updateData: any = {
    updated_at: new Date().toISOString(),
  };

  if (payload.title !== undefined) updateData.title = payload.title;
  if (payload.description !== undefined) updateData.description = payload.description;
  if (payload.budget !== undefined) updateData.budget = payload.budget;
  if (payload.category !== undefined) updateData.category = payload.category;
  if (payload.skills !== undefined) updateData.skills = payload.skills;
  if (payload.deadline !== undefined) updateData.deadline = payload.deadline;
  if (payload.status !== undefined) updateData.status = payload.status;

  const { data, error } = await supabase
    .from("jobs")
    .update(updateData)
    .eq("id", id)
    .select(`
      *,
      clients!inner (
        *,
        profiles!inner (*)
      )
    `)
    .single();

  if (error || !data) {
    console.error("Error updating job:", error);
    return null;
  }

  const typedData = data as unknown as JobWithClient;
  return mapJob(typedData, typedData.clients);
}

// Delete a job
export async function deleteJob(id: string): Promise<boolean> {
  // First get the job to find client_id
  const { data: job } = await supabase
    .from("jobs")
    .select("client_id")
    .eq("id", id)
    .single();

  if (!job) {
    console.error("Job not found");
    return false;
  }

  // Delete the job
  const { error } = await supabase
    .from("jobs")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting job:", error);
    return false;
  }

  // Decrement client's jobs_posted count
  await decrementClientJobsPosted(job.client_id);

  return true;
}

// Helper: Increment client's jobs_posted count
async function incrementClientJobsPosted(clientId: string): Promise<void> {
  const { data: client } = await supabase
    .from("clients")
    .select("jobs_posted")
    .eq("id", clientId)
    .single();

  if (client) {
    await supabase
      .from("clients")
      .update({
        jobs_posted: (client.jobs_posted || 0) + 1,
        updated_at: new Date().toISOString(),
      })
      .eq("id", clientId);
  }
}

// Helper: Decrement client's jobs_posted count
async function decrementClientJobsPosted(clientId: string): Promise<void> {
  const { data: client } = await supabase
    .from("clients")
    .select("jobs_posted")
    .eq("id", clientId)
    .single();

  if (client) {
    await supabase
      .from("clients")
      .update({
        jobs_posted: Math.max((client.jobs_posted || 1) - 1, 0),
        updated_at: new Date().toISOString(),
      })
      .eq("id", clientId);
  }
}