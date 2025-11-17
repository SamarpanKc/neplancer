import type { Database } from "@/types/database";

type ProfilesRow = Database["public"]["Tables"]["profiles"]["Row"];
type FreelancerRow = Database["public"]["Tables"]["freelancers"]["Row"];
type ClientRow = Database["public"]["Tables"]["clients"]["Row"];

export function mapFreelancer(row: FreelancerRow & { profiles: ProfilesRow }, profile: ProfilesRow) {
  return {
    id: row.id,
    username: row.username,
    title: row.title,
    bio: row.bio,
    skills: row.skills,
    hourlyRate: row.hourly_rate,
    totalEarned: row.total_earned,
    completedJobs: row.completed_jobs,
    rating: row.rating,
    totalReviews: row.total_reviews,
    status: row.status,
    portfolioUrl: row.portfolio_url,
    githubUrl: row.github_url,
    linkedinUrl: row.linkedin_url,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    profile: {
      id: profile.id,
      fullName: profile.full_name,
      email: profile.email,
      avatarUrl: profile.avatar_url,
      role: profile.role,
    },
  };
}

export function mapClient(row: ClientRow & { profiles: ProfilesRow }, profile: ProfilesRow) {
  return {
    id: row.id,
    companyName: row.company_name,
    companyDescription: row.company_description,
    website: row.website,
    location: row.location,
    jobsPosted: row.jobs_posted,
    totalSpent: row.total_spent,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    profile: {
      id: profile.id,
      fullName: profile.full_name,
      email: profile.email,
      avatarUrl: profile.avatar_url,
      role: profile.role,
    },
  };
}
