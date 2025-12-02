// app/api/jobs/client/[clientId]/route.ts
import { NextResponse } from 'next/server';
import { getJobsByClientId } from '@/lib/jobs';

// GET /api/jobs/client/[clientId] - Get jobs by client
export async function GET(
  request: Request,
  { params }: { params: { clientId: string } }
) {
  try {
    const jobs = await getJobsByClientId(params.clientId);

    return NextResponse.json({ jobs });
  } catch (error: any) {
    console.error('Error fetching client jobs:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch jobs' },
      { status: 500 }
    );
  }
}