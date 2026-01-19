/**
 * Job-Freelancer Matching API
 * 
 * Provides API endpoints for job recommendations and freelancer matching
 */

import { NextResponse } from 'next/server';
import { 
  recommendFreelancersForJob, 
  rankAllFreelancers,
  searchAndRankFreelancers,
  findSimilarFreelancers 
} from '@/lib/recommendation';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action');
  const jobId = searchParams.get('jobId');
  const freelancerId = searchParams.get('freelancerId');
  const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined;
  const minRating = searchParams.get('minRating') ? parseFloat(searchParams.get('minRating')!) : undefined;

  try {
    switch (action) {
      case 'recommend-for-job':
        if (!jobId) {
          return NextResponse.json({ error: 'jobId is required' }, { status: 400 });
        }
        const recommendations = await recommendFreelancersForJob(jobId, { limit, minRating });
        return NextResponse.json({ freelancers: recommendations });

      case 'rank-all':
        const skills = searchParams.get('skills')?.split(',').filter(Boolean);
        const availableOnly = searchParams.get('availableOnly') === 'true';
        const ranked = await rankAllFreelancers({ 
          limit, 
          minRating, 
          skills, 
          availableOnly 
        });
        return NextResponse.json({ freelancers: ranked });

      case 'search':
        const query = searchParams.get('query') || '';
        const category = searchParams.get('category') || '';
        const searchSkills = searchParams.get('skills')?.split(',').filter(Boolean);
        const maxRate = searchParams.get('maxRate') ? parseFloat(searchParams.get('maxRate')!) : undefined;
        const minRate = searchParams.get('minRate') ? parseFloat(searchParams.get('minRate')!) : undefined;
        
        const searchResults = await searchAndRankFreelancers({
          query,
          skills: searchSkills,
          category,
          minRating,
          maxRate,
          minRate,
          limit,
        });
        return NextResponse.json({ freelancers: searchResults });

      case 'similar':
        if (!freelancerId) {
          return NextResponse.json({ error: 'freelancerId is required' }, { status: 400 });
        }
        const similar = await findSimilarFreelancers(freelancerId, { limit: limit || 5 });
        return NextResponse.json({ freelancers: similar });

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Recommendation API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
