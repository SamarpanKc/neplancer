// app/api/jobs/[id]/route.ts
import { NextResponse } from 'next/server';
import { getJobById, updateJob, deleteJob } from '@/lib/jobs';

// GET /api/jobs/[id] - Get job by ID
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const job = await getJobById(params.id);

    if (!job) {
      return NextResponse.json(
        { error: 'Job not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ job });
  } catch (error: any) {
    console.error('Error fetching job:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch job' },
      { status: 500 }
    );
  }
}

// PATCH /api/jobs/[id] - Update job
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const job = await updateJob(params.id, body);

    if (!job) {
      return NextResponse.json(
        { error: 'Failed to update job' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      job,
    });
  } catch (error: any) {
    console.error('Error updating job:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update job' },
      { status: 500 }
    );
  }
}

// DELETE /api/jobs/[id] - Delete job
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const success = await deleteJob(params.id);

    if (!success) {
      return NextResponse.json(
        { error: 'Failed to delete job' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Job deleted successfully',
    });
  } catch (error: any) {
    console.error('Error deleting job:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete job' },
      { status: 500 }
    );
  }
}