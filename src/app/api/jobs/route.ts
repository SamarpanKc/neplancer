// app/api/jobs/route.ts
import { NextRequest, NextResponse } from 'next/server';
import {
  getAllJobs,
  getJobById,
  getJobsByClientId,
  getJobsByStatus,
  getJobsByClientAndStatus,
  createJob,
  updateJob,
  deleteJob,
} from '@/lib/jobs';

// GET - Fetch jobs
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    const id = searchParams.get('id');
    const clientId = searchParams.get('clientId');
    const status = searchParams.get('status');

    // Fetch single job by ID
    if (id) {
      const job = await getJobById(id);
      
      if (!job) {
        return NextResponse.json(
          { error: 'Job not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({ job });
    }

    // Fetch jobs by client and status
    if (clientId && status && status !== 'all') {
      const jobs = await getJobsByClientAndStatus(
        clientId,
        status as "open" | "in_progress" | "completed" | "cancelled"
      );
      return NextResponse.json({ jobs });
    }

    // Fetch jobs by client
    if (clientId) {
      const jobs = await getJobsByClientId(clientId);
      return NextResponse.json({ jobs });
    }

    // Fetch jobs by status
    if (status && status !== 'all') {
      const jobs = await getJobsByStatus(
        status as "open" | "in_progress" | "completed" | "cancelled"
      );
      return NextResponse.json({ jobs });
    }

    // Fetch all jobs
    const jobs = await getAllJobs();
    return NextResponse.json({ jobs });

  } catch (error) {
    console.error('Error in GET /api/jobs:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Create a new job
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { clientId, title, description, budget, category, skills, deadline } = body;

    // Validation
    if (!clientId || !title || !description || !budget || !category || !skills) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (!Array.isArray(skills) || skills.length === 0) {
      return NextResponse.json(
        { error: 'At least one skill is required' },
        { status: 400 }
      );
    }

    const job = await createJob({
      clientId,
      title,
      description,
      budget: parseFloat(budget),
      category,
      skills,
      deadline: deadline || null,
    });

    if (!job) {
      return NextResponse.json(
        { error: 'Failed to create job' },
        { status: 500 }
      );
    }

    return NextResponse.json({ job }, { status: 201 });

  } catch (error) {
    console.error('Error in POST /api/jobs:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PATCH - Update a job
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, title, description, budget, category, skills, deadline, status } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Job ID is required' },
        { status: 400 }
      );
    }

    const updateData: any = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (budget !== undefined) updateData.budget = parseFloat(budget);
    if (category !== undefined) updateData.category = category;
    if (skills !== undefined) updateData.skills = skills;
    if (deadline !== undefined) updateData.deadline = deadline;
    if (status !== undefined) updateData.status = status;

    const job = await updateJob(id, updateData);

    if (!job) {
      return NextResponse.json(
        { error: 'Failed to update job' },
        { status: 500 }
      );
    }

    return NextResponse.json({ job });

  } catch (error) {
    console.error('Error in PATCH /api/jobs:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE - Delete a job
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Job ID is required' },
        { status: 400 }
      );
    }

    const success = await deleteJob(id);

    if (!success) {
      return NextResponse.json(
        { error: 'Failed to delete job' },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Job deleted successfully' 
    });

  } catch (error) {
    console.error('Error in DELETE /api/jobs:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}