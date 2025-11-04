import { NextResponse } from 'next/server';
import { demoApi } from '@/lib/demoApi';

// GET /api/proposals - Get proposals
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const freelancerId = searchParams.get('freelancerId');
    const jobId = searchParams.get('jobId');

    let proposals;
    if (freelancerId) {
      proposals = await demoApi.getProposalsByFreelancerId(freelancerId);
    } else if (jobId) {
      proposals = await demoApi.getProposalsByJobId(jobId);
    } else {
      proposals = await demoApi.getAllProposals();
    }

    return NextResponse.json({ proposals });
  } catch (error) {
    console.error('Error fetching proposals:', error);
    return NextResponse.json(
      { error: 'Failed to fetch proposals' },
      { status: 500 }
    );
  }
}

// POST /api/proposals - Submit a proposal
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newProposal = await demoApi.createProposal(body);
    return NextResponse.json({ success: true, proposal: newProposal });
  } catch (error) {
    console.error('Error creating proposal:', error);
    return NextResponse.json(
      { error: 'Failed to submit proposal' },
      { status: 500 }
    );
  }
}
