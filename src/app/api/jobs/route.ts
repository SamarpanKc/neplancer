// app/api/jobs/route.ts
import { NextResponse } from 'next/server';
import { getAllJobs, createJob, getJobsByClientId } from '@/lib/jobs';
import { createJobSchema } from '@/lib/validations';
import { ZodError } from 'zod';

// GET /api/jobs - Get all jobs or jobs by client ID
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const clientId = searchParams.get('clientId');
    const status = searchParams.get('status');

    let jobs;
    if (clientId) {
      jobs = await getJobsByClientId(clientId);
      
      // Filter by status if provided
      if (status && status !== 'all') {
        jobs = jobs.filter(job => job.status === status);
      }
    } else {
      jobs = await getAllJobs();
    }

    return NextResponse.json({ jobs });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch jobs' },
      { status: 500 }
    );
  }
}

// POST /api/jobs - Create a new job
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validate request body
    const validatedData = createJobSchema.parse({
      ...body,
      budget: typeof body.budget === 'string' ? parseFloat(body.budget) : body.budget,
    });

    const job = await createJob(validatedData);

    if (!job) {
      throw new Error('Failed to create job');
    }

    return NextResponse.json({
      success: true,
      job,
    });
  } catch (error: any) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: error.message || 'Failed to create job' },
      { status: 500 }
    );
  }
}