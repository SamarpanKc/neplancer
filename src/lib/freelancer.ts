import { supabase } from "./supabase";
import { mapFreelancer } from "./mappers";
import type { Database } from "@/types/database";

export type Freelancer = ReturnType<typeof mapFreelancer>;

type FreelancerWithProfile = Database["public"]["Tables"]["freelancers"]["Row"] & {
  profiles: Database["public"]["Tables"]["profiles"]["Row"];
};

export async function getFreelancerById(id: string): Promise<Freelancer | null> {
  const { data, error } = await supabase
    .from("freelancers")
    .select("*, profiles(*)")
    .eq("id", id)
    .single();

  if (error || !data) {
    console.error(error);
    return null;
  }

  // Type assertion to help TypeScript understand the structure
  const typedData = data as unknown as FreelancerWithProfile;
  return mapFreelancer(typedData, typedData.profiles);
}

export async function getAllFreelancers(): Promise<Freelancer[]> {
  const { data, error } = await supabase
    .from("freelancers")
    .select("*, profiles(*)")
    .order("created_at", { ascending: false });

  if (error || !data) {
    console.error(error);
    return [];
  }

  // Type assertion for the array
  const typedData = data as unknown as FreelancerWithProfile[];
  return typedData.map((row) => mapFreelancer(row, row.profiles));
}

export async function createFreelancer(profileId: string, payload: {
  username: string;
  skills?: string[];
  hourly_rate?: number;
  bio?: string;
  title?: string;
}) {
  const { data, error } = await supabase
    .from("freelancers")
    .insert({
      profile_id: profileId,
      username: payload.username,
      skills: payload.skills ?? [],
      hourly_rate: payload.hourly_rate ?? null,
      bio: payload.bio ?? null,
      title: payload.title ?? null,
    })
    .select("*, profiles(*)")
    .single();

  if (error || !data) {
    console.error(error);
    return null;
  }

  const typedData = data as unknown as FreelancerWithProfile;
  return mapFreelancer(typedData, typedData.profiles);
}