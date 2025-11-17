import { supabase } from "./supabase";
import { mapClient } from "./mappers";
import type { Database } from "@/types/database";

export type Client = ReturnType<typeof mapClient>;

type ClientWithProfile = Database["public"]["Tables"]["clients"]["Row"] & {
  profiles: Database["public"]["Tables"]["profiles"]["Row"];
};

export async function getClientById(id: string): Promise<Client | null> {
  const { data, error } = await supabase
    .from("clients")
    .select("*, profiles(*)")
    .eq("id", id)
    .single();

  if (error || !data) {
    console.error(error);
    return null;
  }

  const typedData = data as unknown as ClientWithProfile;
  return mapClient(typedData, typedData.profiles);
}

export async function getAllClients(): Promise<Client[]> {
  const { data, error } = await supabase
    .from("clients")
    .select("*, profiles(*)")
    .order("created_at", { ascending: false });

  if (error || !data) {
    console.error(error);
    return [];
  }

  const typedData = data as unknown as ClientWithProfile[];
  return typedData.map((row) => mapClient(row, row.profiles));
}

export async function createClient(profileId: string, payload: {
  company?: string;
  description?: string;
  website?: string;
  location?: string;
}) {
  const { data, error } = await supabase
    .from("clients")
    .insert({
      profile_id: profileId,
      company_name: payload.company ?? null,
      company_description: payload.description ?? null,
      website: payload.website ?? null,
      location: payload.location ?? null,
    })
    .select("*, profiles(*)")
    .single();

  if (error || !data) {
    console.error(error);
    return null;
  }

  const typedData = data as unknown as ClientWithProfile;
  return mapClient(typedData, typedData.profiles);
}