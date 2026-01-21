import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get profile role
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single();

    if (profile?.role !== 'client') {
      return NextResponse.json({ error: 'Forbidden - Client access required' }, { status: 403 });
    }

    // Get stats in parallel
    const [
      { count: totalJobsPosted },
      { count: activeJobs },
      { count: totalApplications },
      { data: spending }
    ] = await Promise.all([
      supabase
        .from('jobs')
        .select('*', { count: 'exact', head: true })
        .eq('client_id', session.user.id),
      
      supabase
        .from('jobs')
        .select('*', { count: 'exact', head: true })
        .eq('client_id', session.user.id)
        .eq('status', 'active'),
      
      supabase
        .from('job_applications')
        .select('job:job_id!inner(client_id)', { count: 'exact', head: true })
        .eq('job.client_id', session.user.id),
      
      supabase
        .from('contracts')
        .select('total_amount')
        .eq('client_id', session.user.id)
        .eq('status', 'completed')
    ]);

    const totalSpending = spending?.reduce((sum, contract) => sum + (contract.total_amount || 0), 0) || 0;

    // Get recent jobs
    const { data: recentJobs } = await supabase
      .from('jobs')
      .select(`
        *,
        applications:job_applications(count)
      `)
      .eq('client_id', session.user.id)
      .order('created_at', { ascending: false })
      .limit(5);

    // Get recent contracts
    const { data: recentContracts } = await supabase
      .from('contracts')
      .select(`
        *,
        freelancer:freelancer_id(full_name, avatar_url),
        job:job_id(title, category)
      `)
      .eq('client_id', session.user.id)
      .order('created_at', { ascending: false })
      .limit(5);

    // Get recent activity
    const { data: recentActivity } = await supabase
      .from('activities')
      .select('*')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false })
      .limit(10);

    return NextResponse.json({
      stats: {
        totalJobsPosted: totalJobsPosted || 0,
        activeJobs: activeJobs || 0,
        totalApplications: totalApplications || 0,
        totalSpending,
      },
      recentJobs: recentJobs || [],
      recentContracts: recentContracts || [],
      recentActivity: recentActivity || [],
    });
  } catch (error) {
    console.error('Client dashboard error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
