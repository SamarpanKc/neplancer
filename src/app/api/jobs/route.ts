// app/api/jobs/route.ts
import { NextResponse } from 'next/server';
import { getAllJobs, createJob } from '@/lib/jobs';

// GET /api/jobs - Get all jobs
export async function GET(request: Request) {
  try {
    const jobs = await getAllJobs();
    return NextResponse.json({ jobs });
  } catch (error: any) {
    console.error('Error fetching jobs:', error);
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
    const { clientId, title, description, budget, category, skills, deadline } = body;

    console.log('Received job creation request:', body);

    // Validate required fields
    if (!clientId || !title || !description || !budget || !category) {
      return NextResponse.json(
        { error: 'Missing required fields: clientId, title, description, budget, category' },
        { status: 400 }
      );
    }

    if (budget <= 0) {
      return NextResponse.json(
        { error: 'Budget must be greater than 0' },
        { status: 400 }
      );
    }

    const job = await createJob({
      clientId,
      title,
      description,
      budget: parseFloat(budget),
      category,
      skills: skills || [],
      deadline: deadline || null,
    });

    if (!job) {
      throw new Error('Failed to create job');
    }

    console.log('Job created successfully:', job);

    return NextResponse.json({
      success: true,
      job,
    });
  } catch (error: any) {
    console.error('Error creating job:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create job' },
      { status: 500 }
    );
  }
}