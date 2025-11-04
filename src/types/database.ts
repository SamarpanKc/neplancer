export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          email: string
          full_name: string
          avatar_url: string | null
          role: 'client' | 'freelancer'
        }
        Insert: {
          id: string
          created_at?: string
          updated_at?: string
          email: string
          full_name: string
          avatar_url?: string | null
          role: 'client' | 'freelancer'
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          email?: string
          full_name?: string
          avatar_url?: string | null
          role?: 'client' | 'freelancer'
        }
      }
      clients: {
        Row: {
          id: string
          profile_id: string
          company_name: string | null
          company_description: string | null
          website: string | null
          location: string | null
          jobs_posted: number
          total_spent: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          profile_id: string
          company_name?: string | null
          company_description?: string | null
          website?: string | null
          location?: string | null
          jobs_posted?: number
          total_spent?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          profile_id?: string
          company_name?: string | null
          company_description?: string | null
          website?: string | null
          location?: string | null
          jobs_posted?: number
          total_spent?: number
          created_at?: string
          updated_at?: string
        }
      }
      freelancers: {
        Row: {
          id: string
          profile_id: string
          username: string
          title: string | null
          bio: string | null
          skills: string[]
          hourly_rate: number | null
          total_earned: number
          completed_jobs: number
          rating: number
          total_reviews: number
          status: 'online' | 'connecting' | 'offline'
          portfolio_url: string | null
          github_url: string | null
          linkedin_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          profile_id: string
          username: string
          title?: string | null
          bio?: string | null
          skills?: string[]
          hourly_rate?: number | null
          total_earned?: number
          completed_jobs?: number
          rating?: number
          total_reviews?: number
          status?: 'online' | 'connecting' | 'offline'
          portfolio_url?: string | null
          github_url?: string | null
          linkedin_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          profile_id?: string
          username?: string
          title?: string | null
          bio?: string | null
          skills?: string[]
          hourly_rate?: number | null
          total_earned?: number
          completed_jobs?: number
          rating?: number
          total_reviews?: number
          status?: 'online' | 'connecting' | 'offline'
          portfolio_url?: string | null
          github_url?: string | null
          linkedin_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      jobs: {
        Row: {
          id: string
          client_id: string
          title: string
          description: string
          budget: number
          category: string
          skills: string[]
          status: 'open' | 'in_progress' | 'completed' | 'cancelled'
          deadline: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          client_id: string
          title: string
          description: string
          budget: number
          category: string
          skills?: string[]
          status?: 'open' | 'in_progress' | 'completed' | 'cancelled'
          deadline?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          client_id?: string
          title?: string
          description?: string
          budget?: number
          category?: string
          skills?: string[]
          status?: 'open' | 'in_progress' | 'completed' | 'cancelled'
          deadline?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      proposals: {
        Row: {
          id: string
          job_id: string
          freelancer_id: string
          cover_letter: string
          proposed_budget: number
          estimated_duration: string
          status: 'pending' | 'accepted' | 'rejected'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          job_id: string
          freelancer_id: string
          cover_letter: string
          proposed_budget: number
          estimated_duration: string
          status?: 'pending' | 'accepted' | 'rejected'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          job_id?: string
          freelancer_id?: string
          cover_letter?: string
          proposed_budget?: number
          estimated_duration?: string
          status?: 'pending' | 'accepted' | 'rejected'
          created_at?: string
          updated_at?: string
        }
      }
      contracts: {
        Row: {
          id: string
          job_id: string
          client_id: string
          freelancer_id: string
          budget: number
          terms: string
          status: 'draft' | 'active' | 'completed' | 'cancelled'
          start_date: string
          end_date: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          job_id: string
          client_id: string
          freelancer_id: string
          budget: number
          terms: string
          status?: 'draft' | 'active' | 'completed' | 'cancelled'
          start_date: string
          end_date?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          job_id?: string
          client_id?: string
          freelancer_id?: string
          budget?: number
          terms?: string
          status?: 'draft' | 'active' | 'completed' | 'cancelled'
          start_date?: string
          end_date?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      user_role: 'client' | 'freelancer'
      job_status: 'open' | 'in_progress' | 'completed' | 'cancelled'
      proposal_status: 'pending' | 'accepted' | 'rejected'
      contract_status: 'draft' | 'active' | 'completed' | 'cancelled'
      freelancer_status: 'online' | 'connecting' | 'offline'
    }
  }
}
