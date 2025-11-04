import { NextResponse } from 'next/server';
import { demoApi } from '@/lib/demoApi';
import { Job } from '@/types';

// GET /api/jobs - Get all jobs
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const clientId = searchParams.get('clientId');

    let jobs;
    if (status) {
      jobs = await demoApi.getJobsByStatus(status as Job['status']);
    } else if (clientId) {
      jobs = await demoApi.getJobsByClientId(clientId);
    } else {
      jobs = await demoApi.getAllJobs();
    }

    return NextResponse.json({ jobs });
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch jobs' },
      { status: 500 }
    );
  }
}

// POST /api/jobs - Create a new job
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newJob = await demoApi.createJob(body);
    return NextResponse.json({ success: true, job: newJob });
  } catch (error) {
    console.error('Error creating job:', error);
    return NextResponse.json(
      { error: 'Failed to create job' },
      { status: 500 }
    );
  }
}
